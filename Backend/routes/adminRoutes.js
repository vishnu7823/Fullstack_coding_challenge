const express = require('express');
const { createUser, createStore, dashboardCounts, listUsers, listStores } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/users', authenticate, authorize(['admin']), createUser);
router.post('/stores', authenticate, authorize(['admin']), createStore);
router.get('/dashboard', authenticate, authorize(['admin']), dashboardCounts);
router.get('/users', authenticate, authorize(['admin']), listUsers);
router.get('/stores', authenticate, authorize(['admin']), listStores);

module.exports = router;
