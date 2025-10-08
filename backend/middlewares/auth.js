const jwt = require("jsonwebtoken");

function auth(requiredRole = null) {
    return (req, res, next) => {
        try {
            const header = req.headers["authorization"];
            if (!header) {
                return res.status(401).json({ error: "Missing Authorization header" });
            }

            const [scheme, token] = header.split(" ");
            if (scheme !== "Bearer" || !token) {
                return res.status(401).json({ error: "Invalid Authorization format" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id, role, iat, exp }

            const allowed = Array.isArray(requiredRole)
                ? requiredRole
                : (requiredRole ? [requiredRole] : null);
            if (allowed && !allowed.includes(req.user.role)) {
                return res.status(403).json({ error: "Forbidden: insufficient role" });
            }

            next();
        } catch (err) {
            console.error("Auth error:", err.message);
            return res.status(401).json({ error: "Invalid or expired token" });
        }
    };
}

module.exports = auth;
