const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// USER
router.post('/place', auth, orderController.placeOrder);
router.get('/mine', auth, orderController.getMyOrders);
router.put('/cancel/:orderId', auth, orderController.cancelOrder);

// ADMIN
router.get('/all', orderController.getAllOrders);
router.put('/status/:orderId', orderController.updateStatus);

module.exports = router;
