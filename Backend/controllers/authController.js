const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { nameValid, addressValid, passwordValid, emailValid } = require('../utils/validators');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!nameValid(name)) return res.status(400).json({ error: 'Name must be 20-60 chars' });
    if (!emailValid(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!addressValid(address)) return res.status(400).json({ error: 'Address too long' });
    if (!passwordValid(password)) return res.status(400).json({ error: 'Password invalid' });

    const hashed = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users (name,email,address,password,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role`;
    const values = [name.trim(), email.toLowerCase().trim(), address || '', hashed, role || 'user'];
    const result = await db.query(q, values);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
    console.error('signup err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!emailValid(email) || !password) return res.status(400).json({ error: 'Invalid credentials' });

    const r = await db.query('SELECT id,name,email,password,role FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (r.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Both old & new required' });
    if (!passwordValid(newPassword)) return res.status(400).json({ error: 'New password invalid' });

    const r = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const ok = await bcrypt.compare(oldPassword, r.rows[0].password);
    if (!ok) return res.status(401).json({ error: 'Old password incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('updatePassword err', err);
    res.status(500).json({ error: 'Server error' });
  }
};
