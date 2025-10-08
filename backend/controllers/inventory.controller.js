const inventoryService = require("../services/inventory.service");

async function adjust(req, res) {
    const result = await inventoryService.adjust(req.body);
    res.json(result);
}

module.exports = { adjust };
