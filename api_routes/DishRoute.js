const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// API: Lấy danh sách món ăn
// GET ./api_routes/DishRoute
router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find(); // Lấy tất cả các món ăn
        res.json(dishes); // Trả về danh sách món ăn dưới dạng JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Xử lý lỗi
    }
});

module.exports = router;