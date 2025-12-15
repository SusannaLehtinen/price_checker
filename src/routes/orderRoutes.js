const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new order
router.post('/api/orders/create', authMiddleware, async (req, res) => {
    const userId = req.userData.userId;
    const cart = req.session.cart;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const connection = await db.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction();

        // Calculate total amount
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 1. Create an entry in the `orders` table
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
            [userId, totalAmount]
        );
        const orderId = orderResult.insertId;

        // 2. Create entries in the `order_items` table for each cart item
        const orderItemsPromises = cart.map(item => {
            return connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        });
        await Promise.all(orderItemsPromises);

        // 3. Commit the transaction
        await connection.commit();

        // 4. Clear the cart
        req.session.cart = [];

        res.status(201).json({ message: 'Order created successfully', orderId: orderId });

    } catch (error) {
        await connection.rollback(); // Rollback on error
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    } finally {
        connection.release(); // Always release the connection
    }
});

module.exports = router;
