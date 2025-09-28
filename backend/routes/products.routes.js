const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");
const auth = require("../middlewares/auth");

// Featured
router.get("/featured", productsController.fetchFeaturedProducts);

// קריאה לכל המוצרים
router.get("/", productsController.getAllProducts);

// קריאה למוצר לפי מזהה
router.get("/:id", productsController.getProductById);

// יצירת מוצר – אדמין בלבד
router.post("/", auth("admin"), productsController.createProduct);

// עדכון מוצר – אדמין בלבד
router.put("/:id", auth("admin"), productsController.updateProduct);

// מחיקת מוצר – אדמין בלבד
router.delete("/:id", auth("admin"), productsController.deleteProduct);

module.exports = router;
