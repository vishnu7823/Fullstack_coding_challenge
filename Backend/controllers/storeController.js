const db = require('../config/db');

exports.listStoresForUser = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { search = '', address = '', sort = 'name', order = 'asc', page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const q = `
      SELECT s.id, s.name, s.address,
        COALESCE(avg_r.avg::numeric,0) AS overall_rating,
        ur.rating AS user_rating
      FROM stores s
      LEFT JOIN (
        SELECT store_id, ROUND(AVG(rating)::numeric,2) AS avg FROM ratings GROUP BY store_id
      ) avg_r ON avg_r.store_id = s.id
      LEFT JOIN (
        SELECT store_id, rating FROM ratings WHERE user_id = $5
      ) ur ON ur.store_id = s.id
      WHERE s.name ILIKE $1 AND s.address ILIKE $2
      ORDER BY ${sort === 'name' ? 's.name' : sort === 'address' ? 's.address' : 'overall_rating'} ${order === 'desc' ? 'DESC' : 'ASC'}
      LIMIT $3 OFFSET $4
    `;
    const params = [`%${search}%`, `%${address}%`, Number(limit), offset, userId];
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error('listStoresForUser err', err);
    res.status(500).json({ error: 'Server error' });
  }
};
