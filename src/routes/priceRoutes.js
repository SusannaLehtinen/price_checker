const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');


router.get('/compare', priceController.comparePrices);
router.post('/compare', priceController.comparePrices);

module.exports = router;

