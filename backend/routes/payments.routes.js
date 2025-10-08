const router = require("express").Router();
const auth = require("../middlewares/auth");
const paymentsController = require("../controllers/payments.controller");

// creating payments should be staff-only (or your gateway webhook)
router.post("/", auth(["admin", "manager"]), paymentsController.createPayment);

// GET /api/payments/order/:orderId
router.get("/order/:orderId", auth(), paymentsController.getByOrder);

module.exports = router;
