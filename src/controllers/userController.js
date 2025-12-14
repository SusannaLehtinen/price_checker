// const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existingUsers] = await db.query("SELECT email FROM user WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, 'customer')",
      [username, email, hashed]
    );
    
    const newUser = {
        id: result.insertId,
        email: email,
        role: 'customer'
    };

    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(201).json({ message: "User created", token: token, userId: newUser.id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const [rows] = await db.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ message: "Login success", token: token, userId: user.id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
