const bannerService = require("../services/banners.service");

async function fetchAllBanners(req, res) {
    try {
        const banners = await bannerService.getAllBanners();
        res.json(banners);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch banners" });
    }
}

async function fetchBanners(req, res) {
    try {
        const banners = await bannerService.getActiveBanners();
        res.json(banners);
    } catch (err) {
        console.error("Error fetching banners:", err.message);
        res.status(500).json({ error: "Failed to fetch banners" });
    }
}

async function addBanner(req, res) {
    try {
        const banner = await bannerService.createBanner(req.body);
        res.status(201).json(banner);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function removeBanner(req, res) {
    try {
        await bannerService.deleteBanner(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateBanner(req, res) {
    try {
        const banner = await bannerService.updateBanner(req.params.id, req.body);
        res.json(banner);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    fetchAllBanners,
    fetchBanners,
    addBanner,
    removeBanner,
    updateBanner,
};
