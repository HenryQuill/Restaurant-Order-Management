// Fetch orders on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    fetchDishes(); 
});

// Hàm lấy danh sách đơn hàng từ API 
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

// Hàm lấy danh sách món ăn từ API 
const fetchDishes = async () => {
    try {
        console.log('Đang lấy danh sách món ăn...');
        const response = await fetch('http://localhost:3000/api_routes/DishRoute');
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`Không thể lấy danh sách món ăn: ${response.status} ${response.statusText}`);
        }
        const dishes = await response.json();
        console.log('Dữ liệu món ăn:', dishes);
        renderDishes(dishes); 
    } catch (err) {
        console.error('Error fetching dishes:', err);
        alert('Không thể tải danh sách món ăn. Vui lòng thử lại!');
    }
}

// Hàm hiển thị danh sách đơn hàng lên giao diện
const renderOrders = (orders) => {
    const ordersSlider = document.getElementById('orders-slider');
    ordersSlider.innerHTML = ''; // Xóa nội dung cũ

    orders.forEach(order => {
        const div = document.createElement('div');
        div.classList.add('orderdetail-item'); // Thêm class "orderdetail-item"
        div.innerHTML = `
            <h3>Đơn hàng #${order.orderDetailID}</h3>
            <p>Món ăn: ${order.dishName}</p>
            <p>Số lượng: ${order.quantity}</p>
            <p>Ghi chú: ${order.note || 'Không có ghi chú'}</p>
            <button 
                data-id="${order.orderDetailID}" 
                style="background-color: ${order.isDone ? 'green' : 'red'}; color: white;"
                onclick="markOrderComplete(${order.orderDetailID})">
                ${order.isDone ? 'Hoàn thành':'Chưa hoàn thành'  }
            </button>
        `;
        ordersSlider.appendChild(div);
    });
};

// Hàm hiển thị danh sách món ăn lên giao diện
const renderDishes = (dishes) => {
    const dishesSlider = document.getElementById('dishes-slider');
    dishesSlider.innerHTML = ''; // Xóa nội dung cũ

    dishes.forEach(dish => {
        const div = document.createElement('div');
        div.classList.add('dish-item'); // Thêm class "orderdetail-item"
        div.innerHTML = `
            <h3> ${dish.dishName }</h3>
            <p>Mô tả: ${dish.description}</p>
            <p>Ghi chú: ${dish.note || 'Không có ghi chú'}</p>
            <p>Giá tiền: ${dish.price}</p>
            <button 
                data-id="${dish.dishID}" 
                style="background-color: ${dish.isAvailable ? 'red' : 'green'}; color: white;"
                onclick="markDishAvailable(${dish.dishID})">
                ${dish.isAvailable ? 'Không có sẵn' : 'Có sẵn'}
            </button>
        `;
        dishesSlider.appendChild(div);
    });
};

// Hàm đánh dấu đơn hàng là hoàn thành khi người dùng nhấn nút "Đánh dấu hoàn thành"
const markOrderComplete = async (orderDetailID) => {
    try {
        const response = await fetch(`http://localhost:3000/api_routes/OrderDetailStatusRoute/${orderDetailID}/complete`, {
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

        // Cập nhật giao diện của nút
        const button = document.querySelector(`button[data-id="${orderDetailID}"]`);
        if (updatedOrder.isDone) {
            button.textContent = 'Chưa hoàn thành';
            button.style.backgroundColor = 'red';
        } else {
            button.textContent = 'Hoàn thành';
            button.style.backgroundColor = 'green';
        }

        // Làm mới danh sách đơn hàng
        await fetchOrders();
    } catch (error) {
        console.error('Lỗi khi đánh dấu hoàn thành:', error);
        alert('Không thể cập nhật trạng thái. Vui lòng thử lại!');
    }
};

// Hàm đánh dấu món ăn là có sẵn khi người dùng nhấn nút "Có sẵn"
const markDishAvailable = async (dishID) => {
    try {
        const response = await fetch(`http://localhost:3000/api_routes/DishStatusRoute/${dishID}/available`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật trạng thái món ăn');
        }

        const updatedDish = await response.json();
        console.log('Cập nhật trạng thái thành công:', updatedDish);
        
        // Cập nhật giao diện của nút
        const button = document.querySelector(`button[data-id="${dishID}"]`);
        if (updatedDish.isAvailable) {
            button.textContent = 'Chưa hoàn thành';
            button.style.backgroundColor = 'red';
        } else {
            button.textContent = 'Hoàn thành';
            button.style.backgroundColor = 'green';
        }

        // Làm mới danh sách món ăn
        await fetchDishes(); 
    } catch (error) {
        console.error('Lỗi khi đánh dấu có sẵn:', error);
        alert('Không thể cập nhật trạng thái. Vui lòng thử lại!');
    }
};

// Hàm mở menu điều hướng
function openNav() {
    document.getElementById("myNav").classList.toggle("menu_width");
    document
      .querySelector(".custom_menu-btn")
      .classList.toggle("menu_btn-style");
}

