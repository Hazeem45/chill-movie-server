const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express();

router.post('/register', authController.registerUser);
router.get('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;
