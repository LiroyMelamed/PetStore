const categoryRoutes = require("./routes/categories.routes");
const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const rateLimit = require("./middlewares/rateLimit");
const authRoutes = require("./routes/auth.routes");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

// ===== Middlewares =====
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    credentials: true
}));
app.use(express.json());
app.use(rateLimit);
app.use(morgan("dev"));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ===== Error Handler =====
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
