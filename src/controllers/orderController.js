const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');

// PLACE ORDER
exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = req.body.cart;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        let totalPrice = 0;
        cart.forEach(item => totalPrice += item.price * item.quantity);

        const orderId = await Order.createOrder(userId, totalPrice);

        for (const item of cart) {
            await OrderItems.addItem(orderId, item.id, item.quantity, item.price);
        }

        return res.json({
            message: "Order created successfully",
            orderId,
            totalPrice,
            items: cart
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Order creation failed" });
    }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        await Order.updateStatus(orderId, status);

        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET MY ORDERS (USER)
exports.getMyOrders = async (req, res) => {
    try {

        const userId = req.userData.userId;
        const orders = await Order.getUserOrders(userId);

        for (const order of orders) {
            order.items = await OrderItems.getItemsByOrderId(order.id);
        }

        res.json(orders);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAllOrders();

        for (const order of orders) {
            order.items = await OrderItems.getItemsByOrderId(order.id);
        }

        res.json(orders);

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const userId = req.userData.userId;

        const order = await Order.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({ message: "You cannot cancel someone else's order" });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Only pending orders can be cancelled" });
        }

        await Order.updateStatus(orderId, 'cancelled');

        res.json({ message: "Order cancelled successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while cancelling order" });
    }
};