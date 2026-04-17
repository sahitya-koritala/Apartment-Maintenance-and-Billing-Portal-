const express = require('express');
const router = express.Router();
const { register, login, getResidents } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/residents', protect, admin, getResidents);

module.exports = router;
