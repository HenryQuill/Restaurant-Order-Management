const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
    orderDetailID: {
        type: Number,
        required: true,
        // autoincrement: true,
        unique: true
    },
    note:{
        type:String,
        required: false
    },
    tableID:{
        type: Number,
        required: true
    },
    dishID: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    orderID: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    dishName: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        default: false,
        required: true
    }
});

// create OrderDetail
const OrderDetail = mongoose.model('OrderDetail', OrderDetailSchema);
module.exports = OrderDetail;