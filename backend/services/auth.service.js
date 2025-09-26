const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // חיבור ל-PG
const { JWT_SECRET } = process.env;

// יצירת טוקן
function generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
}

// רישום משתמש
async function register({ name, email, phone, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
        `INSERT INTO users (username, name, email, phone, password_hash, role)
         VALUES ($1, $2, $3, $4, $5, 'customer')
         RETURNING id, name, email, phone, role`,
        [email, name, email, phone, hashed]
    );
    return result.rows[0];
}

// לוגין עם אימייל
async function loginEmail({ email, password }) {
    const result = await db.query(`SELECT * FROM users WHERE email = $1 AND is_active = true`, [email]);
    const user = result.rows[0];
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid credentials");

    return generateToken(user);
}

// בקשת OTP
async function requestOtp(phone) {
    const result = await db.query(`SELECT * FROM users WHERE phone = $1`, [phone]);
    const user = result.rows[0];
    if (!user) throw new Error("User not found");

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await db.query(
        `INSERT INTO otp_codes (user_id, code, expires_at) VALUES ($1, $2, NOW() + interval '5 minutes')`,
        [user.id, code]
    );

    // TODO: חיבור ל-SMS/WhatsApp API (Twilio, Vonage)
    console.log(`OTP for ${phone}: ${code}`);
}

// אימות OTP
async function verifyOtp(phone, code) {
    const result = await db.query(
        `SELECT u.*, o.code, o.expires_at, o.is_used
         FROM users u
         JOIN otp_codes o ON o.user_id = u.id
         WHERE u.phone = $1
         ORDER BY o.created_at DESC LIMIT 1`,
        [phone]
    );
    const record = result.rows[0];
    if (!record) throw new Error("OTP not found");

    if (record.is_used) throw new Error("OTP already used");
    if (record.expires_at < new Date()) throw new Error("OTP expired");
    if (record.code !== code) throw new Error("Invalid code");

    await db.query(`UPDATE otp_codes SET is_used = true WHERE code = $1 AND user_id = $2`, [code, record.id]);

    return generateToken(record);
}

// לוגין עם FaceID
async function loginFaceId(faceIdHash) {
    const result = await db.query(`SELECT * FROM users WHERE face_id_hash = $1`, [faceIdHash]);
    const user = result.rows[0];
    if (!user) throw new Error("User not found");

    return generateToken(user);
}

module.exports = {
    register,
    loginEmail,
    requestOtp,
    verifyOtp,
    loginFaceId,
};
