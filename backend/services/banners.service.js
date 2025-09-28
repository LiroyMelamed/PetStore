const db = require("../config/db");

async function getActiveBanners() {
    return db.any(
        `SELECT id, title, image_url, link_url, is_active 
     FROM banners 
     WHERE is_active = true 
     ORDER BY id ASC`
    );
}

async function createBanner({ title, image_url, link_url, is_active }) {
    return db.one(
        `INSERT INTO banners (title, image_url, link_url, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [title, image_url, link_url, is_active ?? true]
    );
}

async function deleteBanner(id) {
    return db.none("DELETE FROM banners WHERE id = $1", [id]);
}

module.exports = {
    getActiveBanners,
    createBanner,
    deleteBanner,
};
