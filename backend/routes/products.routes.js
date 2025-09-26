const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");
const auth = require("../middlewares/auth");

// ✅ מוצרים פומביים
router.get("/", productsController.getAll);
router.get("/:id", productsController.getById);

// ✅ פעולות שדורשות הרשאות אדמין
router.post("/", auth("admin"), productsController.create);
router.put("/:id", auth("admin"), productsController.update);
router.delete("/:id", auth("admin"), productsController.remove);

module.exports = router;
