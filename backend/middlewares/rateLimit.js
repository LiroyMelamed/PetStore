// backend/middlewares/rateLimit.js
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const isProd = process.env.NODE_ENV === "production";

const keyByUserOrIp = (req) => (req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req));

const defaultLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: isProd ? 200 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyByUserOrIp,
    skip: () => !isProd
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyByUserOrIp
});

const metricsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: isProd ? 60 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyByUserOrIp
});

module.exports = { defaultLimiter, authLimiter, metricsLimiter };
