const { z } = require("zod");
const orderService = require("../services/orders.service");

const orderSchema = z.object({
    customer_id: z.number().int(),
    shipping_address_id: z.number().int(),
    billing_address_id: z.number().int(),
    items: z.array(
        z.object({
            product_id: z.number().int(),
            variant_id: z.number().int().nullable().optional(),
            qty: z.number().int().positive(),
            unit_price: z.number().positive(),
        })
    ),
    discount_code: z.string().optional().nullable(),
});

async function createOrder(req, res, next) {
    try {
        const data = orderSchema.parse(req.body);
        const order = await orderService.createOrder(data);
        res.json(order);
    } catch (err) {
        next(err);
    }
}

module.exports = { createOrder };
