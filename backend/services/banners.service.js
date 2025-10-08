const db = require("../config/db");

// Admin: get all banners (active+inactive) ordered by position then id
async function getAllBanners() {
    return db.any(`
    SELECT id, title, image_url, link_url, is_active, position
    FROM banners
    ORDER BY position ASC, id ASC
  `);
}

// Public: only active banners
async function getActiveBanners() {
    return db.any(`
    SELECT id, title, image_url, link_url, is_active, position
    FROM banners
    WHERE is_active = true
    ORDER BY position ASC, id ASC
  `);
}

async function createBanner({ title, image_url, link_url, is_active, position }) {
    return db.one(
        `
    INSERT INTO banners (title, image_url, link_url, is_active, position)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, image_url, link_url, is_active, position
    `,
        [title, image_url, link_url, is_active ?? true, position ?? 0]
    );
}

// Only update fields that were provided (prevents overwriting with NULL)
async function updateBanner(id, fields) {
    const allowed = ["title", "image_url", "link_url", "is_active", "position"];
    const sets = [];
    const values = [id];
    let i = 2;

    for (const k of allowed) {
        if (fields[k] !== undefined) {
            sets.push(`${k} = $${i++}`);
            values.push(fields[k]);
        }
    }
    if (sets.length === 0) {
        return db.one(
            `SELECT id, title, image_url, link_url, is_active, position FROM banners WHERE id = $1`,
            [id]
        );
    }

    return db.one(
        `
    UPDATE banners
    SET ${sets.join(", ")}, updated_at = NOW()
    WHERE id = $1
    RETURNING id, title, image_url, link_url, is_active, position
    `,
        values
    );
}

async function deleteBanner(id) {
    return db.none(`DELETE FROM banners WHERE id = $1`, [id]);
}

module.exports = {
    getAllBanners,
    getActiveBanners,
    createBanner,
    updateBanner,
    deleteBanner,
};
