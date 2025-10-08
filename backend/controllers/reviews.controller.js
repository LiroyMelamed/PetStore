const reviewsService = require("../services/reviews.service");

async function addReview(req, res) {
    const user_id = req.user?.id; // requires auth()
    const { product_id, rating, title, comment } = req.body;
    const row = await reviewsService.addReview({ product_id, rating, title, comment, user_id });
    res.status(201).json(row);
}

async function getForProduct(req, res) {
    const { productId } = req.params;
    const rows = await reviewsService.getByProduct(productId);
    res.json(rows);
}

module.exports = { addReview, getForProduct };
