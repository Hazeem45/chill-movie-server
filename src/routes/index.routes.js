const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);

module.exports = router;
