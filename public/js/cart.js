document.addEventListener('DOMContentLoaded', async () => {
    const cartGrid = document.querySelector('.cart-grid');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
    const shippingCost = 10.00;

    if (!cartGrid || !subtotalEl || !totalEl || !checkoutBtn) {
        console.error('Required elements not found on the page.');
        return;
    }

    async function fetchCart() {
        try {
            const response = await fetch('/api/cart');
            if (!response.ok) throw new Error('Failed to fetch cart data.');
            return await response.json();
        } catch (error) {
            console.error('Error fetching cart:', error);
            return [];
        }
    }

    function renderCart(cartItems) {
        cartGrid.innerHTML = '';
        let subtotal = 0;

        if (cartItems.length === 0) {
            cartGrid.innerHTML = '<p>Your cart is empty.</p>';
            subtotalEl.textContent = '$0.00';
            totalEl.textContent = `$${shippingCost.toFixed(2)}`;
            checkoutBtn.disabled = true;
            if (window.updateCartCounter) window.updateCartCounter(); // Оновити лічильник до 0
            return;
        }

        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItemHTML = `
                <div class="product-card" data-product-id="${item.id}">
                    <div class="product-card__body">
                        <h2 class="product-card__title">${item.name}</h2>
                        <div class="product-card__meta">
                            <span class="product-card__price">$${item.price.toFixed(2)}</span>
                            <span>Quantity:
                                <input type="number" min="1" value="${item.quantity}" class="item-quantity" style="width: 50px; padding: 2px 5px; border-radius: 4px; border: 1px solid #ccc;">
                            </span>
                        </div>
                    </div>
                    <div class="product-card__footer">
                        <button class="btn btn--outline remove-item-btn">Remove</button>
                    </div>
                </div>
            `;
            cartGrid.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        const total = subtotal + shippingCost;
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
    }

    // Функція для оновлення кількості товару
    async function updateQuantity(productId, quantity) {
        try {
            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: parseInt(quantity, 10) })
            });
            if (!response.ok) throw new Error('Failed to update item.');
            const updatedCart = await response.json();
            renderCart(updatedCart);
            if (window.updateCartCounter) window.updateCartCounter(); // Оновлюємо лічильник у навігації
        } catch (error) {
            console.error('Update cart error:', error);
        }
    }

    // Функція для видалення товару з кошика
    async function removeItem(productId) {
        try {
            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to remove item.');
            const updatedCart = await response.json();
            renderCart(updatedCart);
            if (window.updateCartCounter) window.updateCartCounter(); // Оновлюємо лічильник у навігації
        } catch (error) {
            console.error('Remove cart error:', error);
        }
    }

    // Додаємо єдиний обробник подій для всього кошика (event delegation)
    cartGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.productId;
            removeItem(productId);
        }
    });

    cartGrid.addEventListener('change', (event) => {
        if (event.target.classList.contains('item-quantity')) {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.productId;
            const newQuantity = event.target.value;
            updateQuantity(productId, newQuantity);
        }
    });

    checkoutBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to proceed to checkout.');
            window.location.href = '/login.html';
            return;
        }

        try {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                // alert(`Order created successfully! Order ID: ${result.orderId}`); // Прибираємо alert для кращого UX
                // Redirect to a "my orders" page or home page
                window.location.href = '/my_orders.html';
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create order.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    const cart = await fetchCart();
    renderCart(cart);
});
