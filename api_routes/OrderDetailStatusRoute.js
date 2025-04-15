const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/OrderDetail');

// Endpoint để cập nhật trạng thái isDone
// PATCH ./api_routes/OrderDetailStatusRoute/:orderDetailID/complete
router.patch('/:orderDetailID/complete', async (req, res) => {
    try {
        const orderDetailID = req.params.orderDetailID;
        // Tìm OrderDetail theo orderDetailID
        const orderDetail = await OrderDetail.findOne({ orderDetailID: Number(orderDetailID) });

        if (!orderDetail) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Đảo ngược trạng thái isDone
        orderDetail.isDone = !orderDetail.isDone;
        await orderDetail.save();

        res.status(200).json(orderDetail);
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;