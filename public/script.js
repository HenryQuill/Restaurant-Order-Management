// Fetch orders on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    // fetchMenuItems(); // Uncomment and define if needed
});

const fetchOrders = async () => {
    try {
        console.log('Đang lấy danh sách đơn hàng...');
        const response = await fetch('http://localhost:3000/api_routes/OrderDetailRoute');
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`Không thể lấy danh sách đơn hàng: ${response.status} ${response.statusText}`);
        }
        const orders = await response.json();
        console.log('Dữ liệu đơn hàng:', orders);
        renderOrders(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        alert('Không thể tải danh sách đơn hàng. Vui lòng thử lại!');
    }
};

const renderOrders = (orders) => {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Xóa danh sách cũ

    // Kiểm tra nếu không có đơn hàng
    if (!orders || orders.length === 0) {
        ordersList.innerHTML = '<li>Không có đơn hàng nào.</li>';
        return;
    }

    orders.forEach(order => {
        // Kiểm tra dữ liệu trước khi render
        if (!order.dishName || !order.orderDetailID) {
            console.warn('Dữ liệu đơn hàng không hợp lệ:', order);
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <p>Món ăn: ${order.dishName}</p>
            <p>Số lượng: ${order.quantity || 'Không xác định'}</p>
            <p>Bàn: ${order.tableID || 'Không xác định'}</p>
            <p>Trạng thái: ${order.isDone ? 'Hoàn thành' : 'Chưa hoàn thành'}</p>
            <button onclick="markOrderComplete('${order.orderDetailID}')">
                ${order.isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
            </button>
        `;
        ordersList.appendChild(li);
    });
};

const markOrderComplete = async (orderDetailID) => {
    try {
        const response = await fetch(`http://localhost:3000/api_routes/OrderDetailRoute/${orderDetailID}/complete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật trạng thái đơn hàng');
        }

        const updatedOrder = await response.json();
        console.log('Cập nhật trạng thái thành công:', updatedOrder);

        // Làm mới danh sách đơn hàng
        await fetchOrders();
    } catch (error) {
        console.error('Lỗi khi đánh dấu hoàn thành:', error);
        alert('Không thể cập nhật trạng thái. Vui lòng thử lại!');
    }
};