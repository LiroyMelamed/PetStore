// middlewares/checkoutPricing.js
module.exports = async function checkoutPricing(req, res, next) {
    try {
        // make sure body was parsed
        // (server.js must include app.use(express.json()) before routes)
        const { items = [], discountCode = null, userId, currency = 'ILS' } = req.body || {};

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // example: compute subtotal locally (client prices are not trusted)
        // ideally, load prices from DB by product/variant ids
        // here we just passthrough to next and let controller hit sp_create_order
        req.pricing = { currency, discountCode };
        next();
    } catch (err) {
        next(err);
    }
};
