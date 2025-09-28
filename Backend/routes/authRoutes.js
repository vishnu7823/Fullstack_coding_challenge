const express = require('express');
const { signup, login, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/password', authenticate, updatePassword);

module.exports = router;
