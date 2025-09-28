const express = require("express");
const router = express.Router();
const adminsController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth");

// כל הקריאות האלו דורשות התחברות + תפקיד admin
router.get("/", auth("admin"), adminsController.getAdmins);
router.post("/", auth("admin"), adminsController.addAdmin);
router.delete("/:id", auth("admin"), adminsController.deleteAdmin);

module.exports = router;
