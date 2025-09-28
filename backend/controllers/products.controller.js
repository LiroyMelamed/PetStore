const productService = require("../services/products.service");

async function getAllProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.updateProduct(id, req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Featured products
async function fetchFeaturedProducts(req, res) {
    try {
        const products = await productService.getFeaturedProducts();
        res.json(products);
    } catch (err) {
        console.error("Error fetching featured products:", err.message);
        res.status(500).json({ error: "Failed to fetch featured products" });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    fetchFeaturedProducts,
    updateProduct,
    deleteProduct,
};
