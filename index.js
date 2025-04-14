const mongoose = require('mongoose');
const getNextSequenceValue = require('./helpers/Counter');
const Dish = require('./models/Dish');
const OrderDetail = require('./models/OrderDetail');
const Bill = require('./models/Bill');
const Table = require('./models/Table');
const Staff = require('./models/Staff');
const Shift = require('./models/Shift');

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/Restaurant_Order_Management';
console.log('Connecting to MongoDB...');

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    return initializeCollections();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Function to initialize collections
async function initializeCollections() {
  try {
    const nextDishID = await getNextSequenceValue('dishID');
    const nextOrderDetailID = await getNextSequenceValue('orderDetailID');
    const nextBillID = await getNextSequenceValue('billID');
    const nextTableID = await getNextSequenceValue('tableID');
    const nextStaffID = await getNextSequenceValue('staffID');
    const nextShiftID = await getNextSequenceValue('shiftID');

    // Examle data to insert into collections
    // Dishes
    await Dish.create({ dishID: 1 , dishName: 'Coleslaw', description: 'Advanced salad', note: 'Salmon recipe', price: 10, isAvailable: true });
    await Dish.create({ dishID: 2 , dishName: 'Pho', description: 'Sample Description', note: 'No onions', price: 10, isAvailable: true });
    await Dish.create({ dishID: 3 , dishName: 'Spaghetti', description: 'Classic Italian pasta', note: 'Add extra cheese', price: 12, isAvailable: true });
    await Dish.create({ dishID: 4 , dishName: 'Burger', description: 'Juicy beef burger', note: 'No onions', price: 15, isAvailable: true });
    await Dish.create({ dishID: 5 , dishName: 'Sushi', description: 'Fresh salmon sushi', note: 'Serve with wasabi', price: 20, isAvailable: true });
    await Dish.create({ dishID: 6 , dishName: 'Tacos', description: 'Mexican-style tacos', note: 'Spicy sauce on the side', price: 10, isAvailable: true });
    await Dish.create({ dishID: 7 , dishName: 'Steak', description: 'Grilled ribeye steak', note: 'Medium rare', price: 25, isAvailable: true });
    await Dish.create({ dishID: 8 , dishName: 'Caesar Salad', description: 'Crispy romaine lettuce', note: 'Extra croutons', price: 8, isAvailable: true });    
    
    // Shifts
    await Shift.create({ shiftID:1 , shiftName: 'Morning', startTime: Date.now(), endTime: Date.now() + 8 * 60 * 60 * 1000});
    await Shift.create({ shiftID:2 , shiftName: 'Afternoon', startTime: Date.now() + 8 * 60 * 60 * 1000, endTime: Date.now() + 16 * 60 * 60 * 1000});
    await Shift.create({ shiftID:3 , shiftName: 'Evening', startTime: Date.now() + 16 * 60 * 60 * 1000, endTime: Date.now() + 24 * 60 * 60 * 1000});

    // Staffs
    await Staff.create({ staffID:1 , staffName: 'John Doe', role: 'Manager', shiftID: 1 });
    await Staff.create({ staffID:2 , staffName: 'Jane Smith', role: 'Waiter', shiftID: 2 });
    await Staff.create({ staffID:3 , staffName: 'Alice Johnson', role: 'Chef', shiftID: 3 });
    
    // Tables
    await Table.create({ tableID: 1 , orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] });
    await Table.create({ tableID: 2 , orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] });
    await Table.create({ tableID: 3 , orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] });
    await Table.create({ tableID: 4 , orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] });
    await Table.create({ tableID: 5 , orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] });
    
    // Order Details
    await OrderDetail.create({ orderDetailID:1 , tableID: 1, dishID: 1, price: 10, orderID: 1, quantity: 2, dishName: 'Coleslaw', isDone: false });
    await OrderDetail.create({ orderDetailID:2 , tableID: 1, dishID: 2, price: 10, orderID: 1, quantity: 1, dishName: 'Pho', isDone: false });
    await OrderDetail.create({ orderDetailID:3 , tableID: 2, dishID: 3, price: 12, orderID: 2, quantity: 1, dishName: 'Spaghetti', isDone: false });
    await OrderDetail.create({ orderDetailID:4 , tableID: 2, dishID: 4, price: 15, orderID: 2, quantity: 1, dishName: 'Burger', isDone: false });
    await OrderDetail.create({ orderDetailID:5 , tableID: 3, dishID: 5, price: 20, orderID: 3, quantity: 2, dishName: 'Sushi', isDone: false });
    await OrderDetail.create({ orderDetailID:6 , tableID: 3, dishID: 6, price: 10, orderID: 3, quantity: 1, dishName: 'Tacos', isDone: false });
    await OrderDetail.create({ orderDetailID:7 , tableID: 4, dishID: 7, price: 25, orderID: 4, quantity: 1, dishName: 'Steak', isDone: false });
    await OrderDetail.create({ orderDetailID:8 , tableID: 4, dishID: 8, price: 8, orderID: 4, quantity: 1, dishName: 'Caesar Salad', isDone: false });
    await OrderDetail.create({ orderDetailID:9 , tableID: 5, dishID: 1, price: 10, orderID: 5, quantity: 2, dishName: 'Coleslaw', isDone: false });
    await OrderDetail.create({ orderDetailID:10 , tableID: 5, dishID: 2, price: 10, orderID: 5, quantity: 1, dishName: 'Pho', isDone: false });
    
    // Bills
    await Bill.create({ billID:1 , tableID: 1, totalPrice: 20});
    await Bill.create({ billID:2 , tableID: 2, totalPrice: 27});
    await Bill.create({ billID:3 , tableID: 3, totalPrice: 30});
    await Bill.create({ billID:4 , tableID: 4, totalPrice: 33});
    await Bill.create({ billID:5 , tableID: 5, totalPrice: 20});

    console.log('Collections initialized successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error initializing collections:', err);
    mongoose.connection.close();
  }
}
