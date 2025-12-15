const db = require('../config/db');

exports.createOrder = async (userId, totalPrice) => {
    const sql = `
        INSERT INTO orders (user_id, total_price, status)
        VALUES (?, ?, 'pending')
    `;
    const [result] = await db.query(sql, [userId, totalPrice]);
    return result.insertId;
};

exports.updateStatus = async (orderId, status) => {
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    await db.query(sql, [status, orderId]);
};

exports.getAllOrders = async () => {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    return rows;
};

exports.getUserOrders = async (userId) => {
    const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [userId]);
    return rows;
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.userData.userId;

        console.log("BACKEND USER ID:", userId);

        const orders = await Order.getUserOrders(userId);

        for (const order of orders) {
            order.items = await OrderItems.getItemsByOrderId(order.id);
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load user orders" });
    }
};

exports.getOrderById = async (orderId) => {
    const sql = `SELECT * FROM orders WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [orderId]);
    return rows[0];
};