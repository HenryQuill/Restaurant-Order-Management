const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    billID: {
        type: Number,
        required: true,
        // autoIncrement: true,
        unique: true
    },
    tableID: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;