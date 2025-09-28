const db = require('../config/db');

exports.rateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);
    const { rating } = req.body;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const q = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES ($1,$2,$3)
      ON CONFLICT (user_id, store_id)
      DO UPDATE SET rating = EXCLUDED.rating, created_at = NOW()
      RETURNING *;
    `;
    const r = await db.query(q, [userId, storeId, rating]);
    res.json(r.rows[0]);
  } catch (err) {
    console.error('rateStore err', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStoreRatingsForOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.storeId);

    // check store belongs to owner
    const s = await db.query('SELECT * FROM stores WHERE id = $1 AND owner_id = $2', [storeId, ownerId]);
    if (s.rows.length === 0) return res.status(403).json({ error: 'Forbidden or store not found' });

    const listQ = `
      SELECT u.id as user_id, u.name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `;
    const avgQ = `SELECT ROUND(AVG(rating)::numeric,2) AS average FROM ratings WHERE store_id = $1`;
    const [listR, avgR] = await Promise.all([db.query(listQ, [storeId]), db.query(avgQ, [storeId])]);
    res.json({ raters: listR.rows, average: avgR.rows[0].average || 0 });
  } catch (err) {
    console.error('getStoreRatingsForOwner err', err);
    res.status(500).json({ error: 'Server error' });
  }
};
