const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller");
const auth = require("../middlewares/auth");

// Public
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:id/products", controller.getProductsByCategory);

// Admin
router.post("/", auth("admin"), controller.create);
router.put("/:id", auth("admin"), controller.update);
router.delete("/:id", auth("admin"), controller.remove);

module.exports = router;
