const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// ... (existing code for cart management)

router.post('/api/cart/add', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    try {
        const [products] = await db.execute('SELECT id, name, price FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = products[0];

        const productPrice = Number(product.price);
        if (isNaN(productPrice)) {
            console.error('Invalid product price from DB:', product.price);
            return res.status(500).json({ message: 'Invalid product price.' });
        }

        const existingProductIndex = req.session.cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            req.session.cart[existingProductIndex].quantity += quantity;
        } else {
            req.session.cart.push({
                id: product.id,
                name: product.name,
                price: productPrice,
                quantity: quantity
            });
        }

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Failed to save session' });
            }
            res.status(200).json({ message: 'Product added to cart', cart: req.session.cart });
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
});

router.get('/api/cart', (req, res) => {
    if (!req.session.cart) {
        return res.json([]);
    }
    res.json(req.session.cart);
});

router.put('/api/cart/item/:productId', (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!req.session.cart) {
        return res.status(400).json({ message: 'Cart not found' });
    }

    const itemIndex = req.session.cart.findIndex(item => item.id == productId);

    if (itemIndex > -1) {
        req.session.cart[itemIndex].quantity = parseInt(quantity, 10);
        req.session.save(err => {
            if (err) return res.status(500).json({ message: 'Failed to update cart' });
            res.status(200).json(req.session.cart);
        });
    } else {
        res.status(404).json({ message: 'Item not found in cart' });
    }
});

router.delete('/api/cart/item/:productId', (req, res) => {
    const { productId } = req.params;

    if (!req.session.cart) {
        return res.status(400).json({ message: 'Cart not found' });
    }

    req.session.cart = req.session.cart.filter(item => item.id != productId);

    req.session.save(err => {
        if (err) return res.status(500).json({ message: 'Failed to update cart' });
        res.status(200).json(req.session.cart);
    });
});

// Create a new order
router.post('/api/orders/create', authMiddleware, async (req, res) => {
    const userId = req.userData.userId;
    const cart = req.session.cart;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // ВИПРАВЛЕНО: Додаємо вартість доставки на back-end
        const shippingCost = 0.80;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total_price = subtotal + shippingCost;

        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
            [userId, total_price]
        );
        const orderId = orderResult.insertId;

        const orderItemsPromises = cart.map(item => {
            return connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        });
        await Promise.all(orderItemsPromises);

        await connection.commit();

        req.session.cart = [];

        req.session.save((err) => {
            if (err) {
                console.error('Session save error after order creation:', err);
            }
            res.status(201).json({ message: 'Order created successfully', orderId: orderId });
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    } finally {
        connection.release();
    }
});

// ... (existing routes for my-orders and cancel)

router.get('/api/my-orders', authMiddleware, async (req, res) => {
    const userId = req.userData.userId;

    try {
        const sql = `
            SELECT
                o.id,
                o.total_price,
                o.status,
                o.created_at,
                GROUP_CONCAT(p.name SEPARATOR ', ') as products
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;

        const [orders] = await db.execute(sql, [userId]);

        res.status(200).json(orders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

router.put('/api/orders/cancel/:orderId', authMiddleware, async (req, res) => {
    const userId = req.userData.userId;
    const orderId = req.params.orderId;

    try {
        const [result] = await db.execute(
            'UPDATE orders SET status = "cancelled" WHERE id = ? AND user_id = ? AND status = "pending"',
            [orderId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found or cannot be cancelled (status not pending).' });
        }

        res.status(200).json({ message: `Order ${orderId} cancelled successfully.` });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Failed to cancel order.' });
    }
});

module.exports = router;
