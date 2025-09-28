const db = require('../config/db');
const { nameValid, addressValid, passwordValid, emailValid } = require('../utils/validators');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!nameValid(name)) return res.status(400).json({ error: 'Name must be 20-60 chars' });
    if (!emailValid(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!addressValid(address)) return res.status(400).json({ error: 'Address too long' });
    if (!passwordValid(password)) return res.status(400).json({ error: 'Password invalid' });
    if (!['admin','user','store_owner'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const hashed = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users (name,email,address,password,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role`;
    const r = await db.query(q, [name.trim(), email.toLowerCase().trim(), address || '', hashed, role]);
    res.status(201).json({ user: r.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
    console.error('createUser err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name || name.trim().length === 0) return res.status(400).json({ error: 'Store name required' });
    const q = `INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4) RETURNING *`;
    const r = await db.query(q, [name.trim(), email || null, address || null, owner_id || null]);
    res.status(201).json({ store: r.rows[0] });
  } catch (err) {
    console.error('createStore err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.dashboardCounts = async (req, res) => {
  try {
    const usersQ = 'SELECT COUNT(*)::int AS total_users FROM users';
    const storesQ = 'SELECT COUNT(*)::int AS total_stores FROM stores';
    const ratingsQ = 'SELECT COUNT(*)::int AS total_ratings FROM ratings';
    const [u, s, r] = await Promise.all([db.query(usersQ), db.query(storesQ), db.query(ratingsQ)]);
    res.json({
      totalUsers: u.rows[0].total_users,
      totalStores: s.rows[0].total_stores,
      totalRatings: r.rows[0].total_ratings
    });
  } catch (err) {
    console.error('dashboardCounts err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { search = '', role = '', sort = 'name', order = 'asc', page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params = [`%${search}%`, role ? role : null, Number(limit), offset];
    // If role is empty, ignore role filter
    const q = role
      ? `SELECT id,name,email,address,role FROM users WHERE (name ILIKE $1 OR email ILIKE $1 OR address ILIKE $1) AND role = $2 ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'} LIMIT $3 OFFSET $4`
      : `SELECT id,name,email,address,role FROM users WHERE (name ILIKE $1 OR email ILIKE $1 OR address ILIKE $1) ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'} LIMIT $3 OFFSET $4`;
    const result = await db.query(q, role ? params : [params[0], params[2], params[3]]);
    res.json(result.rows);
  } catch (err) {
    console.error('listUsers err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { search = '', address = '', sort = 'name', order = 'asc', page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const q = `
      SELECT s.*, COALESCE(avg_r.avg::numeric,0) AS overall_rating
      FROM stores s
      LEFT JOIN (
        SELECT store_id, AVG(rating) AS avg FROM ratings GROUP BY store_id
      ) avg_r ON avg_r.store_id = s.id
      WHERE s.name ILIKE $1 AND s.address ILIKE $2
      ORDER BY ${sort === 'name' ? 's.name' : sort === 'address' ? 's.address' : 'overall_rating'} ${order === 'desc' ? 'DESC' : 'ASC'}
      LIMIT $3 OFFSET $4
    `;
    const result = await db.query(q, [`%${search}%`, `%${address}%`, Number(limit), offset]);
    res.json(result.rows);
  } catch (err) {
    console.error('listStores err', err);
    res.status(500).json({ error: 'Server error' });
  }
};
