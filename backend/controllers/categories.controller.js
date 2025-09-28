const categoryService = require("../services/categories.service");

// Get all
async function getAll(req, res) {
    try {
        const categories = await categoryService.getAll();
        res.json(categories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Get by ID
async function getById(req, res) {
    try {
        const category = await categoryService.getById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Create
async function create(req, res) {
    try {
        const category = await categoryService.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update
async function update(req, res) {
    try {
        const category = await categoryService.update(req.params.id, req.body);
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Delete
async function remove(req, res) {
    try {
        await categoryService.remove(req.params.id);
        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getProductsByCategory(req, res) {
    try {
        const { id } = req.params;
        const products = await categoryService.getProductsByCategory(id);
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { getAll, getById, create, update, remove, getProductsByCategory };
