const express = require("express");
const { createOrder } = require("../controllers/orders.controller");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Create a new order (checkout)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               shipping_address_id:
 *                 type: integer
 *               billing_address_id:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     variant_id:
 *                       type: integer
 *                       nullable: true
 *                     qty:
 *                       type: integer
 *                     unit_price:
 *                       type: number
 *               discount_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 */


const router = express.Router();

// ✅ Checkout API
router.post("/checkout", auth(), createOrder);

module.exports = router;
