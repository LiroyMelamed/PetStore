const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");
const checkoutPricing = require("../middlewares/checkoutPricing");
const auth = require("../middlewares/auth");

// צריך טוקן כדי לבצע פעולות
router.post("/checkout", auth(), checkoutPricing, ordersController.checkout);
router.get("/my", auth(), ordersController.getMyOrders);
router.get("/:id", auth(), ordersController.getOrderById);

// רק אדמין משנה סטטוס
router.patch("/:id/status", auth("admin"), ordersController.updateStatus);
router.get("/", auth(["admin", "manager"]), ordersController.getAll);

module.exports = router;
