const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/OrderDetail');

// API: Lấy danh sách đơn hàng
// GET ./api_routes/OrderDetailRoute
router.get('/', async (req, res) => {
    try {
        const orders = await OrderDetail.find(); // Lấy tất cả các đơn hàng
        res.json(orders); // Trả về danh sách đơn hàng dưới dạng JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Xử lý lỗi
    }
});

module.exports = router;