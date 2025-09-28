const express = require('express');
const { listStoresForUser } = require('../controllers/storeController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, listStoresForUser);

module.exports = router;
