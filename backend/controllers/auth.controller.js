const authService = require("../services/auth.service");

// רישום
async function register(req, res) {
    try {
        const { name, email, phone, password } = req.body;
        const user = await authService.register({ name, email, phone, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// לוגין עם אימייל+סיסמה
async function loginEmail(req, res) {
    try {
        const { email, password } = req.body;
        const token = await authService.loginEmail({ email, password });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// בקשת OTP לפלאפון
async function requestOtp(req, res) {
    try {
        const { phone } = req.body;
        await authService.requestOtp(phone);
        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// אימות OTP
async function verifyOtp(req, res) {
    try {
        const { phone, code } = req.body;
        const token = await authService.verifyOtp(phone, code);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// לוגין עם FaceID
async function loginFaceId(req, res) {
    try {
        const { faceIdHash } = req.body;
        const token = await authService.loginFaceId(faceIdHash);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    register,
    loginEmail,
    requestOtp,
    verifyOtp,
    loginFaceId,
};
