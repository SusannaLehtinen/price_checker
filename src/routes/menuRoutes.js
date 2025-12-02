const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/menu', async (req, res) => {
  try {
    const sql = `
      SELECT id, name, description, price, image
      FROM products
      ORDER BY id DESC
    `;

    const [products] = await db.execute(sql);

    res.render('menu', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error loading menu');
  }
});

module.exports = router;
