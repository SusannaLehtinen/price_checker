require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');

const menuRoutes = require('./routes/menuRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', menuRoutes);

app.use('/api/auth', authRoutes);
app.use('/admin', authMiddleware, adminRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

module.exports = app;
