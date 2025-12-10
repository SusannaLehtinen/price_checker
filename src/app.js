require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware'); // Додано

const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Налаштування CORS для дозволу передачі credentials (cookies)
app.use(cors({
    origin: true, // Або вкажіть ваш фронтенд домен, наприклад 'http://localhost:3000'
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Налаштування сесій
app.use(session({
    secret: 'your_super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Для HTTP. Для HTTPS встановіть 'true'
        httpOnly: true, // Допомагає захиститися від XSS
        sameSite: 'lax' // Рекомендовано для безпеки
    }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));

// Підключення маршрутів
app.use('/', menuRoutes);
app.use('/', cartRoutes);

app.use('/api/auth', authRoutes);
// Захищаємо адмін-маршрути за допомогою adminMiddleware
app.use('/admin', adminMiddleware, adminRoutes); // Змінено

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

module.exports = app;
