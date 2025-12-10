document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');

    async function loadMyOrders() {
        const token = localStorage.getItem("token");
        if (!token) {
            ordersContainer.innerHTML = '<p>Please <a href="/login.html">login</a> to see your orders.</p>';
            return;
        }

        try {
            const response = await fetch("/api/my-orders", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch orders.');
            }

            const orders = await response.json();
            renderOrders(orders);

        } catch (error) {
            console.error('Error loading orders:', error);
            ordersContainer.innerHTML = `<p>Error loading orders: ${error.message}</p>`;
        }
    }

    async function cancelOrder(orderId) {
        if (!confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert('You must be logged in to cancel an order.');
            window.location.href = '/login.html'; // Redirect to login if not authenticated
            return;
        }

        try {
            const response = await fetch(`/api/orders/cancel/${orderId}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel order.');
            }

            const result = await response.json();
            alert(result.message);
            loadMyOrders(); // Reload orders to update status
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert(`Error: ${error.message}`);
        }
    }

    function renderOrders(orders) {
        ordersContainer.innerHTML = "";

        if (!Array.isArray(orders) || orders.length === 0) {
            ordersContainer.innerHTML = `<p>You haven't placed any orders yet.</p>`;
            return;
        }

        orders.forEach(order => {
            const orderCard = `
                <div class="product-card">
                    <div class="product-card__body">
                        <h2 class="product-card__title">Order #${order.id}</h2>
                        <p class="product-card__description">
                            <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br>
                            <strong>Total:</strong> $${Number(order.total_price).toFixed(2)}<br>
                            <strong>Status:</strong> <span class="status status--${order.status}">${order.status}</span>
                        </p>
                        <div class="product-card__meta">
                            <strong>Products:</strong>
                            <p>${order.products}</p>
                        </div>
                        ${order.status === "pending" ? `
                            <button class="btn btn--outline cancel-order-btn" data-order-id="${order.id}" style="margin-top: 15px;">
                                Cancel Order
                            </button>
                        ` : ""}
                    </div>
                </div>
            `;
            ordersContainer.insertAdjacentHTML('beforeend', orderCard);
        });

        // Add event listeners to newly rendered buttons
        document.querySelectorAll('.cancel-order-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderId = event.target.dataset.orderId;
                cancelOrder(orderId);
            });
        });
    }

    loadMyOrders();
});
