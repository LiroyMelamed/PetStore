const router = require("express").Router();
const auth = require("../middlewares/auth");
const reviewsController = require("../controllers/reviews.controller");

// POST /api/reviews
router.post("/", auth(), reviewsController.addReview);

// GET /api/reviews/product/:productId
router.get("/product/:productId", reviewsController.getForProduct);

module.exports = router;
