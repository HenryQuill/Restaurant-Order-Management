const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const Dish = require('./models/Dish');
const OrderDetail = require('./models/OrderDetail');
const Bill = require('./models/Bill');
const Table = require('./models/Table');
const Staff = require('./models/Staff');
const Shift = require('./models/Shift');

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/Restaurant_Order_Management';
console.log('Connecting to MongoDB...');

// Import routes
const OrderDetailRoute = require('./api_routes/OrderDetailRoute');
const OrderDetailStatusRoute = require('./api_routes/OrderDetailStatusRoute');
const DishRoute = require('./api_routes/DishRoute');
const DishStatusRoute = require('./api_routes/DishStatusRoute');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api_routes/OrderDetailRoute', OrderDetailRoute);
app.use('/api_routes/OrderDetailStatusRoute', OrderDetailStatusRoute);
app.use('/api_routes/DishRoute', DishRoute);
app.use('/api_routes/DishStatusRoute', DishStatusRoute);

// Function to initialize collections
async function initializeCollections() {
  try {
    // Check if data already exists to avoid duplicates
    const dishCount = await Dish.countDocuments();
    if (dishCount === 0) {
      await Dish.create([
        { dishID: 1, image: 'images/thit_bo_bong_tuyet.jpg', dishName: 'Thịt bò bông tuyết', description: 'it is RAW', price: 10, isAvailable: false },
        // { dishID: 2, dishName: 'Pho', description: 'Sample Description',  price: 10, isAvailable: true },
        // { dishID: 3, dishName: 'Spaghetti', description: 'Classic Italian pasta',  price: 12, isAvailable: true },
        // { dishID: 4, dishName: 'Burger', description: 'Juicy beef burger', price: 15, isAvailable: true },
        // { dishID: 5, dishName: 'Sushi', description: 'Fresh salmon sushi', price: 20, isAvailable: true },
        // { dishID: 6, dishName: 'Tacos', description: 'Mexican-style tacos', price: 10, isAvailable: true },
        // { dishID: 7, dishName: 'Steak', description: 'Grilled ribeye steak',  price: 25, isAvailable: true },
        // { dishID: 8, dishName: 'Caesar Salad', description: 'Crispy romaine lettuce', price: 8, isAvailable: true },

      ]);
      console.log('Dishes initialized');
    }

    const shiftCount = await Shift.countDocuments();
    if (shiftCount === 0) {
      await Shift.create([
        { shiftID: 1, shiftName: 'Morning', startTime: Date.now(), endTime: Date.now() + 8 * 60 * 60 * 1000 },
        { shiftID: 2, shiftName: 'Afternoon', startTime: Date.now() + 8 * 60 * 60 * 1000, endTime: Date.now() + 16 * 60 * 60 * 1000 },
        { shiftID: 3, shiftName: 'Evening', startTime: Date.now() + 16 * 60 * 60 * 1000, endTime: Date.now() + 24 * 60 * 60 * 1000 },
      ]);
      console.log('Shifts initialized');
    }

    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      await Staff.create([
        { staffID: 1, staffName: 'John Doe', role: 'Manager', shiftID: 1 },
        { staffID: 2, staffName: 'Jane Smith', role: 'Waiter', shiftID: 2 },
        { staffID: 3, staffName: 'Alice Johnson', role: 'Chef', shiftID: 3 },
      ]);
      console.log('Staff initialized');
    }

    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      await Table.create([
        { tableID: 1, orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] },
        { tableID: 2, orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] },
        { tableID: 3, orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] },
        { tableID: 4, orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] },
        { tableID: 5, orderDate: Date.now(), createTime: Date.now(), orderStatus: 'Pending', shiftID: 1, listOrderDetail: [] },
      ]);
      console.log('Tables initialized');
    }

    const orderDetailCount = await OrderDetail.countDocuments();
    if (orderDetailCount === 0) {
      await OrderDetail.create([
        { orderDetailID: 1, note: 'không rau', tableID: 1, dishID: 1, price: 10, orderID: 1, quantity: 2, dishName: 'test', isDone: false },
        // { orderDetailID: 2, note: 'ít mắm', tableID: 1, dishID: 2, price: 10, orderID: 1, quantity: 1, dishName: 'Pho', isDone: false },
        // { orderDetailID: 3, note: 'không sốt', tableID: 2, dishID: 3, price: 12, orderID: 2, quantity: 1, dishName: 'Spaghetti', isDone: false },
        // { orderDetailID: 4, note: 'thêm phô mai', tableID: 2, dishID: 4, price: 15, orderID: 2, quantity: 1, dishName: 'Burger', isDone: false },
        // { orderDetailID: 5, note: 'ít wasabi', tableID: 3, dishID: 5, price: 20, orderID: 3, quantity: 2, dishName: 'Sushi', isDone: false },
        // { orderDetailID: 6, note: 'không hành', tableID: 3, dishID: 6, price: 10, orderID: 3, quantity: 1, dishName: 'Tacos', isDone: false },
        // { orderDetailID: 7, note: 'chín vừa', tableID: 4, dishID: 7, price: 25, orderID: 4, quantity: 1, dishName: 'Steak', isDone: false },
        // { orderDetailID: 8, note: 'không crouton', tableID: 4, dishID: 8, price: 8, orderID: 4, quantity: 1, dishName: 'Caesar Salad', isDone: false },
        // { orderDetailID: 9, note: 'thêm sốt', tableID: 5, dishID: 1, price: 10, orderID: 5, quantity: 2, dishName: 'Coleslaw', isDone: false },
        // { orderDetailID: 10, note: 'nhiều rau', tableID: 5, dishID: 2, price: 10, orderID: 5, quantity: 1, dishName: 'Pho', isDone: false }
      ]);
      console.log('OrderDetails initialized');
    }

    const billCount = await Bill.countDocuments();
    if (billCount === 0) {
      await Bill.create([
        { billID: 1, tableID: 1, totalPrice: 20 },
        { billID: 2, tableID: 2, totalPrice: 27 },
        { billID: 3, tableID: 3, totalPrice: 30 },
        { billID: 4, tableID: 4, totalPrice: 33 },
        { billID: 5, tableID: 5, totalPrice: 20 },
      ]);
      console.log('Bills initialized');
    }

    console.log('Collections initialized successfully!');
  } catch (err) {
    console.error('Error initializing collections:', err);
    throw err;
  }
}

// Connect to MongoDB and start the server
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');
    await initializeCollections(); // Initialize collections
    // Start the server only after MongoDB is connected and collections are initialized
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });