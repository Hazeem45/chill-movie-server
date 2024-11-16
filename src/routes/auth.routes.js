const express = require('express');
const authController = require('../controllers/auth.controller');
const refreshTokenRateLimiter = require('../middlewares/rateLimiter');
const router = express();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh-token', refreshTokenRateLimiter, authController.refreshAccessToken);

module.exports = router;
