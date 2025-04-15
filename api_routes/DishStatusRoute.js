const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// Endpoint để cập nhật trạng thái isAvailable
// PATCH ./api_routes/DishStatusRoute/:dishID/available
router.patch('/:dishID/available', async (req, res) => {
    try {
        const dishID = req.params.dishID;
        // Tìm Dish theo dishID
        const dish = await Dish.findOne({ dishID: Number(dishID) });

        if (!dish) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        }

        // Đảo ngược trạng thái isAvailable
        dish.isAvailable = !dish.isAvailable;
        
        await dish.save();

        res.status(200).json(dish);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái món ăn:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;