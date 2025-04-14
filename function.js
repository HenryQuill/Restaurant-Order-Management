const mongoose = require('mongoose');
const Order = require('../models/OrderDetail');

/**
 * API 1: Tạo đơn hàng mới
 * POST /api/orders/create
 */
// Hàm helper: xác định ca trực dựa trên thời gian 
function getShiftByTime(date) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();

  // CA1: 6:50 → 9:20 → 410 → 560
  if (totalMinutes >= 410 && totalMinutes < 570) {
    return "CA1";
  }
  // CA2: 9:30 → 12:00 → 570 → 720
  else if (totalMinutes >= 570 && totalMinutes < 765) {
    return "CA2";
  }
  // CA3: 12:45 → 15:15 → 765 → 915
  else if (totalMinutes >= 765 && totalMinutes < 925) {
    return "CA3";
  }
  // CA4: 15:25 → 17:55 → 925 → 1075
  else if (totalMinutes >= 925 && totalMinutes < 1075) {
    return "CA4";
  }
  // CA5: 17:55 → 22:00 → 1075 → 1320
  else if (totalMinutes >= 1075 && totalMinutes < 1320) {
    return "CA5";
  }
  // Ngoài các ca trên
  else {
    return "Overtime";
  }
}

exports.createOrder = async (req, res) => {
  try {
    const { table_id, table_number, shift_id } = req.body;
    
    const createdTime = new Date();

    const finalShiftID = shift_id ? shift_id : getShiftByTime(createdTime);

    const newOrderID = new mongoose.Types.ObjectId();
    const orderDetailsID = 'OD' + Date.now();

    const newOrder = new Order({
      orderID: newOrderID,
      orderDetailsID: orderDetailsID,
      tableID: table_id,
      tableNumber: table_number,
      totalPrice: 0,
      createdTime: createdTime,
      orderStatus: 'pending',
      shiftID: finalShiftID, 
      listMeal: []
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      order_id: savedOrder._id,
      orderID: savedOrder.orderID,
      orderDetailsID: savedOrder.orderDetailsID,
      table_id: savedOrder.tableID,
      table_number: savedOrder.tableNumber,
      shift_id: savedOrder.shiftID,
      total_price: savedOrder.totalPrice,
      created_time: savedOrder.createdTime,
      order_status: savedOrder.orderStatus,
      listMeal: savedOrder.listMeal
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * API 2: Thêm món vào đơn hàng
 * POST /api/orders/add-item
 */
exports.addItem = async (req, res) => {
  try {
    const { order_id, name, note, quantity, price, status, mealID } = req.body;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.listMeal.push({
      name,
      note,
      quantity,
      price,
      status,
      mealID
    });

    const updatedOrder = await order.save();
    res.status(200).json({
      message: 'Item added successfully',
      updated_order: updatedOrder
    });
  } catch (error) {
    console.error('Error in addItem:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * API 3: Xem chi tiết đơn hàng
 * GET /api/orders/:order_id
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      order_id: order._id,
      orderID: order.orderID,
      orderDetailsID: order.orderDetailsID,
      table_id: order.tableID,
      table_number: order.tableNumber,
      total_price: order.totalPrice,
      created_time: order.createdTime,
      order_status: order.orderStatus,
      listMeal: order.listMeal
    });
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * API 4: Huỷ món đã đặt
 * DELETE /api/orders/:order_id/item/:item_id
 */
exports.cancelItem = async (req, res) => {
  try {
    const { order_id, item_id } = req.params;
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const initialLength = order.listMeal.length;

    order.listMeal.pull(item_id);

    if (order.listMeal.length === initialLength) {
      return res.status(404).json({ error: 'Item not found in listMeal' });
    }

    const updatedOrder = await order.save();
    res.status(200).json({
      message: 'Item canceled successfully',
      updated_order: updatedOrder
    });
  } catch (error) {
    console.error('Error in cancelItem:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/*
 * API 5: Xác nhận món ăn đã hoàn thành
 * POST /api/kitchen/confirm-item
 */
exports.confirmItem = async (req, res) => {
  try {
    const { order_id, mealID } = req.body; 
    
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let updated = false;
    order.listMeal.forEach(meal => {
      if (meal.mealID.toString() === mealID && meal.status !== 'confirmed') {
        meal.status = 'confirmed';
        updated = true;
      }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Meal not found or already confirmed' });
    }

    const updatedOrder = await order.save();
    res.status(200).json({
      message: 'Xác nhận món đã sẵn sàng để phục vụ',
      updated_order: updatedOrder
    });
  } catch (error) {
    console.error('Error in confirmItem:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * API 6: Xem danh sách món đang chờ chế biến
 * GET /api/kitchen/orders
 * Giả sử: "đang chờ chế biến" nghĩa là orderStatus = "pending"
 */
exports.getPendingOrders = async (req, res) => {
  try {
    // Lọc các đơn hàng có orderStatus = "pending"
    const pendingOrders = await Order.find({ orderStatus: "pending" })
      .select("_id tableID listMeal")
      .lean();

    // Định dạng kết quả
    const formattedOrders = pendingOrders.map(order => ({
      order_id: order._id,
      table_id: order.tableID,
      items: order.listMeal
    }));

    res.status(200).json({ pending_orders: formattedOrders });
  } catch (error) {
    console.error("Error in getPendingOrders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * API 7 (mới): Hoàn tất đơn hàng
 * POST /api/orders/complete
 * Tính tổng tiền dựa trên listMeal, cập nhật totalPrice, 
 * và có thể đặt orderStatus = "completed".
 */
exports.completeOrder = async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let finalBill = 0;
    order.listMeal.forEach(meal => {
      finalBill += meal.quantity * meal.price;
    });

    order.totalPrice = finalBill;
    order.orderStatus = 'completed';

    await order.save();

    res.status(200).json({
      message: 'Đơn hàng đã được hoàn tất',
      final_bill: {
        order_id: order._id,
        table_id: order.tableID,
        table_number: order.tableNumber,
        total_price: finalBill,
        items: order.listMeal
      }
    });
  } catch (error) {
    console.error('Error in completeOrder:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// API 8 Doanh thu
exports.getRevenue = async (req, res) => {
  try {
    const { start_date, shift_id, end_date } = req.query;
    
    if (!start_date) {
      return res.status(400).json({ error: "start_date is required" });
    }
    
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : new Date();

    const filter = {
      createdTime: { $gte: startDate, $lte: endDate }
    };

    if (shift_id) {
      filter.shiftID = shift_id;
    }

    const orders = await Order.find(filter).lean();

    const total_orders = orders.length;
    let total_revenue = 0;
    orders.forEach(order => {
      total_revenue += order.totalPrice;
    });

    res.status(200).json({
      total_orders,
      total_revenue,
      detail_orders: orders
    });
  } catch (error) {
    console.error('Error in getRevenue:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
// API 9: LỊch sử hóa đơn 
exports.getOrderHistory = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date) {
      return res.status(400).json({ error: "start_date is required" });
    }
    
    const startDate = new Date(start_date);
    const endDate = end_date ? new Date(end_date) : new Date();
    
    const filter = {
      createdTime: { $gte: startDate, $lte: endDate },
      orderStatus: 'completed'
    };

    const orders = await Order.find(filter)
      .select("_id tableID totalPrice orderStatus createdTime")
      .lean();

    const orderHistory = orders.map(order => ({
      order_id: order._id,
      table_id: order.tableID,
      total_price: order.totalPrice,
      status: order.orderStatus,
      timestamp: order.createdTime
    }));

    res.status(200).json({ orders: orderHistory });
  } catch (error) {
    console.error("Error in getOrderHistory:", error);
    res.status(500).json({ error: "Server error" });
  }
};