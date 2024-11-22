const express = require('express');
const refreshTokenRateLimiter = require('../middlewares/rateLimiter');
const validation = require('../middlewares/validation');
const {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerAdmin,
	registerEmail,
	verifyEmail,
} = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validations/validators');
const router = express.Router();

router.post('/register', registerValidator, validation, registerUser);
router.post('/login', loginValidator, validation, loginUser);
router.post('/refresh-token', refreshTokenRateLimiter, refreshAccessToken);
router.post('/register-admin', registerValidator, validation, registerAdmin);
router.post('/logout', logoutUser);
router.post('/register-email', registerEmail);
router.get('/verify-email', verifyEmail);

module.exports = router;
