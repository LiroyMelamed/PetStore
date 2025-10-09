// middlewares/checkoutPricing.js
module.exports = function checkoutPricing(req, res, next) {
    try {
        const { items = [], discount_code = null, currency = 'ILS' } = req.body || {};
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        // userId is taken from req.user by the controller; don’t require here.
        req.pricing = { currency, discount_code };
        next();
    } catch (err) { next(err); }
};
