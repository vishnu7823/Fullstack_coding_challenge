const express = require('express');
const { rateStore, getStoreRatingsForOwner } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// user rates store
router.post('/:storeId/rate', authenticate, rateStore);

// store owner sees ratings
router.get('/:storeId/ratings', authenticate, authorize(['store_owner']), getStoreRatingsForOwner);

module.exports = router;
