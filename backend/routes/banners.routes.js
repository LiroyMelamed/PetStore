const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banners.controller");
const auth = require("../middlewares/auth");

// Public
router.get("/", bannerController.fetchBanners);

// Admin
router.get("/all", auth(["admin", "manager"]), bannerController.fetchAllBanners);
router.post("/", auth(["admin", "manager"]), bannerController.addBanner);
router.put("/:id", auth(["admin", "manager"]), bannerController.updateBanner);
router.delete("/:id", auth(["admin", "manager"]), bannerController.removeBanner);

module.exports = router;
