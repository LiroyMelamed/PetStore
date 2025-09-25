// ייבוא חבילות
require('dotenv').config();
const cors = require('cors'); // ייבוא חבילת cors
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// פונקציית middleware לאימות טוקן
const authMiddleware = (req, res, next) => {
    // בדיקה אם הטוקן נשלח בכותרת הבקשה
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication failed: No token provided' });
    }

    try {
        // אימות הטוקן
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // שמירת המידע מהטוקן על אובייקט הבקשה, כולל ה-role
        req.userData = { userId: decodedToken.id, username: decodedToken.username, role: decodedToken.role };
        next(); // המשך לנתיב ה-API
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed: Invalid token' });
    }
};

// הגדרת חיבור למסד נתונים באמצעות משתני סביבה
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// בדיקת חיבור למסד הנתונים
pool.connect((err) => {
    if (err) {
        console.error('Connection error to PostgreSQL:', err.stack);
    } else {
        console.log('Connected successfully to PostgreSQL database!');
    }
});

// Middlewares
app.use(cors()); // הפעלת ה-CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const superuserAuthMiddleware = (req, res, next) => {
    if (req.userData.role !== 'superuser') {
        return res.status(403).json({ error: 'Forbidden: Superuser access required' });
    }
    next();
};

// --- נתיבי API המשתמשים ב-Stored Procedures ---

// נתיבי מוצרים
app.post('/api/products', authMiddleware, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            image_url,
            category_id,
            seo_title,
            seo_description
        } = req.body;

        // המרות טיפוסים
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);
        const parsedCategoryId = parseInt(category_id, 10);

        const result = await pool.query(
            'SELECT * FROM add_product($1, $2, $3, $4, $5, $6, $7, $8)',
            [
                name,
                description,
                parsedPrice,
                parsedStock,
                image_url,
                parsedCategoryId,
                seo_title,
                seo_description
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM get_all_products()');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM get_product_by_id($1)', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url, category_id, seo_title, seo_description } = req.body;
        const result = await pool.query(
            'SELECT * FROM update_product($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [id, name, description, price, stock, image_url, category_id, seo_title, seo_description]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('SELECT delete_product($1)', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// נתיבי קטגוריות
app.post('/api/categories', authMiddleware, async (req, res) => {
    try {
        const { name, seo_title, seo_description } = req.body;
        const result = await pool.query('SELECT * FROM add_category($1, $2, $3)', [name, seo_title, seo_description]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM get_all_categories()');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/categories/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, seo_title, seo_description } = req.body;
        const result = await pool.query(
            'SELECT * FROM update_category($1, $2, $3, $4)',
            [id, name, seo_title, seo_description]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/categories/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('SELECT delete_category($1)', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// נתיבי הזמנות
app.post('/api/orders', authMiddleware, async (req, res) => {
    try {
        const { customer_name, customer_email, shipping_address, total_price } = req.body;
        const result = await pool.query('SELECT * FROM add_order($1, $2, $3, $4)', [customer_name, customer_email, shipping_address, total_price]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM get_all_orders()');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/orders/:id/status', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query('SELECT * FROM update_order_status($1, $2)', [id, status]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// נתיב הרשמה
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(password, 10);
        // קריאה לפונקציית SQL ליצירת משתמש
        const result = await pool.query('SELECT * FROM add_user($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (err) {
        if (err.constraint === 'users_username_key') {
            return res.status(409).json({ error: 'Username already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// נתיב התחברות
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // בדיקת התאמת הסיסמה המצפינה
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // יצירת טוקן JWT עם ה-role של המשתמש
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

app.post('/api/create-admin', authMiddleware, superuserAuthMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(password, 10);
        // קריאה לפונקציית SQL ליצירת משתמש עם תפקיד 'admin'
        const result = await pool.query('SELECT * FROM add_user($1, $2, $3)', [username, hashedPassword, 'admin']);
        res.status(201).json({ message: 'Admin user created successfully', user: result.rows[0] });
    } catch (err) {
        if (err.constraint === 'users_username_key') {
            return res.status(409).json({ error: 'Username already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Server error during admin creation' });
    }
});

// --- נתיבי ניהול מנהלים ---

// GET /api/admins - קבלת רשימת כל המנהלים
// ===========================================
//          >>> הוספה חדשה <<<
// ===========================================
app.get('/api/admins', authMiddleware, superuserAuthMiddleware, async (req, res) => {
    try {
        // שאילתה שמחזירה את כל המשתמשים שהם מנהלים או מנהלי-על
        // חשוב: בוחרים רק את העמודות שאנחנו רוצים להציג ולא את password_hash
        const result = await pool.query(
            "SELECT id, username, role FROM users WHERE role IN ('admin', 'superuser')"
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ message: 'שגיאה פנימית בשרת.' });
    }
});

// POST /api/admins - יצירת מנהל חדש (מוגן למנהלי-על בלבד)
app.post('/api/admins', authMiddleware, superuserAuthMiddleware, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || password.length < 8) {
        return res.status(400).json({ message: 'שם משתמש וסיסמה (לפחות 8 תווים) נדרשים.' });
    }

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'שם המשתמש כבר קיים במערכת.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hashedPassword, 'admin']
        );

        res.status(201).json({ message: 'Admin user created successfully', user: result.rows[0] });

    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ message: 'שגיאה פנימית בשרת.' });
    }
});


// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});