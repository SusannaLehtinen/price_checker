document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.getElementById('admin-orders-table-body');
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    if (!token) {
        // Redirect to login or show an error if not authenticated
        window.location.href = '/login.html';
        return;
    }

    async function fetchAllOrders() {
        try {
            const response = await fetch('/admin/orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch orders.');
            }

            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            console.error('Error fetching all orders:', error);
            if (ordersTableBody) {
                ordersTableBody.innerHTML = `<tr><td colspan="7">Error loading orders: ${error.message}</td></tr>`;
            }
        }
    }

    async function updateOrderStatus(orderId, newStatus) {
        try {
            // ВИПРАВЛЕНО: Правильний URL для оновлення статусу
            const response = await fetch(`/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status.');
            }

            alert(`Order ${orderId} status updated to ${newStatus}.`);
            fetchAllOrders(); // Reload orders to show updated status
        } catch (error) {
            console.error('Error updating order status:', error);
            alert(`Error: ${error.message}`);
        }
    }

    function renderOrders(orders) {
        if (!ordersTableBody) return;

        ordersTableBody.innerHTML = ''; // Clear existing content

        if (orders.length === 0) {
            ordersTableBody.innerHTML = '<tr><td colspan="7">No orders found.</td></tr>';
            return;
        }

        orders.forEach(order => {
            const row = ordersTableBody.insertRow();
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user_email}</td>
                <td>$${Number(order.total_price).toFixed(2)}</td>
                <td>${order.products}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>
                    <select class="order-status-select" data-order-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn--small btn--primary save-status-btn" data-order-id="${order.id}">Save</button>
                </td>
            `;
        });

        // Add event listeners for status changes
        ordersTableBody.querySelectorAll('.save-status-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderId = event.target.dataset.orderId;
                const newStatus = event.target.closest('tr').querySelector('.order-status-select').value;
                updateOrderStatus(orderId, newStatus);
            });
        });
    }

    // Initial fetch of orders
    fetchAllOrders();
});
