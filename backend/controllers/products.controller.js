const productService = require("../services/products.service");

// GET /api/products
async function getAll(req, res, next) {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
}

// GET /api/products/:id
async function getById(req, res, next) {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        next(err);
    }
}

// POST /api/products
async function create(req, res, next) {
    try {
        const { name, description, price, category_id, stock } = req.body;
        const product = await productService.createProduct({ name, description, price, category_id, stock });
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}

// PUT /api/products/:id
async function update(req, res, next) {
    try {
        const { name, description, price, category_id, stock } = req.body;
        const product = await productService.updateProduct(req.params.id, { name, description, price, category_id, stock });
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        next(err);
    }
}

// DELETE /api/products/:id
async function remove(req, res, next) {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted", product });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
