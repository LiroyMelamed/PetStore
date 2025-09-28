const orderService = require("../services/orders.service");

async function checkout(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const {
            items,
            discount_code,
            currency,
            shipping_address_id,
            billing_address_id,
            shipping_address, // { country, city, street, house_no, postal_code }
            billing_address  // { country, city, street, house_no, postal_code }
        } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items array is required" });
        }

        const order = await orderService.checkout({
            userId,
            items,
            discount_code: discount_code || null,
            currency: currency || "ILS",
            shipping_address_id,
            billing_address_id,
            shipping_address,
            billing_address
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getMyOrders(req, res) {
    try {
        const userId = req.user?.id;
        const orders = await orderService.getMyOrders(userId);
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await orderService.updateStatus(id, status);
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    checkout,
    getOrderById,
    getMyOrders,
    updateStatus,
};
