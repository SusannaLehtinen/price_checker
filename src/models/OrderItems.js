const db = require('../config/db');

exports.getItemsByOrderId = async (orderId) => {
    const sql = `SELECT * FROM order_items WHERE order_id = ?`;
    const [rows] = await db.query(sql, [orderId]);
    return rows;
};

exports.addItem = async (orderId, productId, quantity, price) => {
    const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [orderId, productId, quantity, price]);
};
