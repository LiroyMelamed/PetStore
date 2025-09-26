const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");
const auth = require("../middlewares/auth");

// פומבי
router.get("/", categoriesController.getAll);
router.get("/:id", categoriesController.getById);

// אדמין בלבד
router.post("/", auth("admin"), categoriesController.create);
router.put("/:id", auth("admin"), categoriesController.update);
router.delete("/:id", auth("admin"), categoriesController.remove);

module.exports = router;
