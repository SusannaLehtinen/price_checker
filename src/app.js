require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware');

const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// НОВИЙ MIDDLEWARE: Робить кількість товарів у кошику доступною для всіх шаблонів
app.use((req, res, next) => {
    if (req.session.cart) {
        res.locals.cartItemCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
    } else {
        res.locals.cartItemCount = 0;
    }
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', menuRoutes);
app.use('/', cartRoutes);

app.use('/api/auth', authRoutes);
app.use('/admin', adminMiddleware, adminRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

module.exports = app;
