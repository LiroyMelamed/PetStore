// backend/server.js
const { defaultLimiter, authLimiter, metricsLimiter } = require("./middlewares/rateLimit");
const categoryRoutes = require("./routes/categories.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const errorHandler = require("./middlewares/errorHandler");
const paymentsRoutes = require("./routes/payments.routes");
const productRoutes = require("./routes/products.routes");
const bannerRoutes = require("./routes/banners.routes");
const reviewRoutes = require("./routes/reviews.routes");
const adminsRoutes = require("./routes/admin.routes");
const orderRoutes = require("./routes/orders.routes");
const authRoutes = require("./routes/auth.routes");

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const isProd = process.env.NODE_ENV === "production";

// ===== Core middlewares =====
app.set("trust proxy", 1); // needed for real client IPs behind proxies/docker
app.use(helmet());

// Allow localhost by default if env not set
const fallbackOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = (process.env.ALLOWED_ORIGINS?.split(",") || []).filter(Boolean);
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : fallbackOrigins,
    credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// ===== Rate limiters =====
// Default limiter for all API routes (auto-skipped in dev by our middleware)
app.use("/api", defaultLimiter);

// Tighter limiter ONLY for auth endpoints
app.use("/api/auth", authLimiter, authRoutes);

// Roomier limiter ONLY for dashboard metrics (must be mounted before adminsRoutes)
app.use("/api/admins/metrics", metricsLimiter);

// ===== Routes =====
app.use("/api/orders", orderRoutes);
app.use("/api/admins", adminsRoutes); // includes /metrics/* handlers too
app.use("/api/banners", bannerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/categories", categoryRoutes);

// ===== Error Handler =====
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    if (!isProd) console.log("⚙️  Rate limiting is disabled in development.");
});
