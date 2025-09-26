const categoryService = require("../services/categories.service");

// GET /api/categories
async function getAll(req, res, next) {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
}

// GET /api/categories/:id
async function getById(req, res, next) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (err) {
        next(err);
    }
}

// POST /api/categories
async function create(req, res, next) {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategory({ name });
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
}

// PUT /api/categories/:id
async function update(req, res, next) {
    try {
        const { name } = req.body;
        const category = await categoryService.updateCategory(req.params.id, { name });
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (err) {
        next(err);
    }
}

// DELETE /api/categories/:id
async function remove(req, res, next) {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json({ message: "Category deleted", category });
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
