const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");
const auth = require("../middlewares/auth");

// צריך טוקן כדי לבצע פעולות
router.post("/checkout", auth(), ordersController.checkout);
router.get("/my", auth(), ordersController.getMyOrders);
router.get("/:id", auth(), ordersController.getOrderById);

// רק אדמין משנה סטטוס
router.patch("/:id/status", auth("admin"), ordersController.updateStatus);

module.exports = router;
