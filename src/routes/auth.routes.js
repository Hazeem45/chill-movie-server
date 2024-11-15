const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh-token', authController.refreshAccessToken);

module.exports = router;
