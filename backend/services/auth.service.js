const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// יצירת טוקן JWT
function generateToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// ===== Register =====
async function register({ name, email, phone, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.one(
        `INSERT INTO users (username, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, 'user')
     RETURNING id, username, email, phone, role, created_at`,
        [name, email, phone, hashedPassword]
    );

    return user;
}

// ===== Login with email/password =====
async function loginEmail({ email, password }) {
    const user = await db.oneOrNone(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    return { token: generateToken(user), user: { id: user.id, email: user.email, role: user.role } };
}

// ===== OTP login (phone) =====
async function requestOtp(phone) {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE phone = $1`, [phone]);
    if (!user) throw new Error("User not found");

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await db.none(
        `INSERT INTO otp_codes (user_id, code, expires_at)
     VALUES ($1, $2, NOW() + interval '5 minutes')`,
        [user.id, code]
    );

    console.log(`📲 OTP for ${phone}: ${code}`);
    return true;
}

async function verifyOtp(phone, code) {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE phone = $1`, [phone]);
    if (!user) throw new Error("User not found");

    const otp = await db.oneOrNone(
        `SELECT * FROM otp_codes
     WHERE user_id = $1 AND code = $2 AND is_used = false AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
        [user.id, code]
    );
    if (!otp) throw new Error("Invalid or expired OTP");

    await db.none(`UPDATE otp_codes SET is_used = true WHERE id = $1`, [otp.id]);

    return { token: generateToken(user), user: { id: user.id, phone: user.phone, role: user.role } };
}

// ===== FaceID login =====
async function loginFaceId(faceIdHash) {
    const user = await db.oneOrNone(`SELECT * FROM users WHERE face_id_hash = $1`, [faceIdHash]);
    if (!user) throw new Error("User not found");

    return { token: generateToken(user), user: { id: user.id, email: user.email, role: user.role } };
}

module.exports = {
    register,
    loginEmail,
    requestOtp,
    verifyOtp,
    loginFaceId,
};
