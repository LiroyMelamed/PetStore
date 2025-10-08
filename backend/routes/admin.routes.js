// backend/routes/admins.routes.js
const express = require("express");
const router = express.Router();
const adminsController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth");

// People
router.get("/", auth(["admin", "manager"]), adminsController.getAdmins);
router.post("/", auth(["admin"]), adminsController.addAdmin);
router.delete("/:id", auth(["admin"]), adminsController.deleteAdmin);
router.patch("/users/:id/role", auth(["admin"]), adminsController.setUserRole);

// Analytics
router.get("/metrics/overview", auth(["admin", "manager"]), adminsController.metricsOverview);
router.get("/metrics/orders-over-time", auth(["admin", "manager"]), adminsController.ordersOverTime);
router.get("/metrics/revenue-over-time", auth(["admin", "manager"]), adminsController.revenueOverTime);
router.get("/metrics/orders-by-status", auth(["admin", "manager"]), adminsController.ordersByStatus);
router.get("/metrics/top-products", auth(["admin", "manager"]), adminsController.topProducts);

module.exports = router;
