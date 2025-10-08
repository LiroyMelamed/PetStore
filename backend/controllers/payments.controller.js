const paymentsService = require("../services/payments.service");

async function createPayment(req, res) {
    const row = await paymentsService.createPayment(req.body);
    res.status(201).json(row);
}

async function getByOrder(req, res) {
    const { orderId } = req.params;
    const rows = await paymentsService.getByOrder(orderId);
    res.json(rows);
}

module.exports = { createPayment, getByOrder };
