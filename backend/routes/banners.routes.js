const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banners.controller");
const auth = require("../middlewares/auth");

// Public
router.get("/", bannerController.fetchBanners);

// Admin
router.post("/", auth("admin"), bannerController.addBanner);
router.delete("/:id", auth("admin"), bannerController.removeBanner);

module.exports = router;
