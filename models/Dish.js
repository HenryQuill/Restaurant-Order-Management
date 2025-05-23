const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    dishID: {
        type: Number,
        unique: true,
        // autoincrement: true,
        required: true
    },
    image: {
        type: String,
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
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: false,
        required: false
    }
});

// create OrderDetail
const Dish = mongoose.model('Dish', DishSchema);
module.exports = Dish;