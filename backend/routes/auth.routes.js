const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// רישום
router.post("/register", authController.register);

// לוגין בסיסי עם אימייל+סיסמה
router.post("/login-email", authController.loginEmail);

// לוגין עם פלאפון+OTP
router.post("/login-phone/request", authController.requestOtp);
router.post("/login-phone/verify", authController.verifyOtp);

// לוגין עם FaceID
router.post("/login-faceid", authController.loginFaceId);

module.exports = router;
