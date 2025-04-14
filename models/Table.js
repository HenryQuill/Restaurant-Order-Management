const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    tableID: {
        type: Number,
        required: true,
        // autoIncrement: true,
        unique: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    createTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending','Completed', 'Cancelled'], 
        default: 'Pending'
    },
    shiftID: {
        type: Number,
        required: true
    },
    listOrderDetail: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderDetail',
            required: true
        }
    ]
});

const Table = mongoose.model('Table', TableSchema);
module.exports = Table;