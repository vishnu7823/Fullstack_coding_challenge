const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/rating', ratingRoutes);

app.get('/', (req, res) => res.send('Server running'));

// quick db test
db.query('SELECT NOW()').then(r => console.log('DB connected at', r.rows[0].now)).catch(err => console.error('DB err', err));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
