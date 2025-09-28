const adminsService = require("../services/admin.service");

// קבלת רשימת אדמינים
async function getAdmins(req, res) {
    try {
        const admins = await adminsService.getAdmins();
        res.json(admins);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// הוספת אדמין
async function addAdmin(req, res) {
    try {
        const { userId } = req.body; // ID של המשתמש שהופך לאדמין
        const admin = await adminsService.addAdmin(userId);
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// מחיקת אדמין
async function deleteAdmin(req, res) {
    try {
        const { id } = req.params;
        await adminsService.deleteAdmin(id);
        res.json({ message: "Admin removed successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getAdmins,
    addAdmin,
    deleteAdmin,
};
