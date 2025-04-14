const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    dishID: {
        type: Number,
        unique: true,
        // autoincrement: true,
        required: true
    },
    dishName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    }
});

// create OrderDetail
const Dish = mongoose.model('Dish', DishSchema);
module.exports = Dish;