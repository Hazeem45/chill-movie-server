const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 5,
	message: { message: 'Too many requests, please try again later.' },
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res, next, options) => {
		return res.status(429).json(options.message);
	},
});
