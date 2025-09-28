const db = require("../config/db");

// שליפת כל האדמינים
async function getAdmins() {
    const result = await db.query(
        `SELECT id, username, email, role, created_at
     FROM users
     WHERE role = 'admin'`
    );
    return result.rows;
}

// הוספת אדמין
async function addAdmin(userId) {
    const result = await db.query(
        `UPDATE users
     SET role = 'admin'
     WHERE id = $1
     RETURNING id, username, email, role, created_at`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    return result.rows[0];
}

// הסרת אדמין (הופך ל־user רגיל)
async function deleteAdmin(userId) {
    const result = await db.query(
        `UPDATE users
     SET role = 'user'
     WHERE id = $1
     RETURNING id`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("Admin not found");
    }

    return true;
}

module.exports = {
    getAdmins,
    addAdmin,
    deleteAdmin,
};
