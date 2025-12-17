const express = require('express');
const router = express.Router();
// const db = require('../config/db');

// POST route to save a new product
router.post('/add-product', async (req, res) => {
  const { name, description, price, image } = req.body;

  try {
    const sql = `
      INSERT INTO products (name, description, price, image)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(sql, [name, description, price, image || null]);
    res.status(200).json({ message: 'Product saved successfully!' });
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: 'Error saving product' });
  }
});

// GET route to list all products for admin (API)
router.get('/products', async (req, res) => {
  try {
    const sql = 'SELECT id, name, description, price, image FROM products';
    const [rows] = await db.execute(sql);

    res.json(rows);  // this route is now a clean JSON API
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error loading products');
  }
});

// DELETE product by ID
router.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const sql = "DELETE FROM products WHERE id = ?";
    await db.execute(sql, [productId]);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});


// GET one product by ID (for edit form)
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const sql = 'SELECT id, name, description, price, image FROM products WHERE id = ?';
    const [rows] = await db.execute(sql, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]); // return single product object
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Error loading product' });
  }
});

// UPDATE product by ID
router.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, image } = req.body;

  try {
    const sql = `
      UPDATE products
      SET name = ?, description = ?, price = ?, image = ?
      WHERE id = ?
    `;

    await db.execute(sql, [
      name,
      description,
      price,
      image || null,
      productId
    ]);

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Error updating product' });
  }
});




// GET route to fetch all orders
router.get('/orders', async (req, res) => {
    try {
        const sql = `
            SELECT
                o.id,
                o.user_id,
                u.email as user_email,
                o.total_price,
                o.status,
                o.created_at,
                GROUP_CONCAT(p.name SEPARATOR ', ') as products
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN user u ON o.user_id = u.id -- ВИПРАВЛЕНО: 'users' змінено на 'user'
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const [orders] = await db.execute(sql);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// PUT route to update an order's status
router.put('/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const sql = 'UPDATE orders SET status = ? WHERE id = ?';
        const [result] = await db.execute(sql, [status, orderId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json({ message: `Order ${orderId} status updated to ${status}.` });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status.' });
    }
});

module.exports = router;
