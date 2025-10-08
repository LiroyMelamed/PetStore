const router = require("express").Router();
const auth = require("../middlewares/auth");
const inventoryController = require("../controllers/inventory.controller");

router.post("/adjust", auth(["admin", "manager"]), inventoryController.adjust);

module.exports = router;
