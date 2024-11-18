const { body } = require('express-validator');

const registerValidator = [
	body('username')
		.trim()
		.notEmpty().withMessage('Username is required')
		.isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
	body('password')
		.notEmpty().withMessage('Password is required')
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
		.matches(/\d/).withMessage('Password must contain at least one number')
		.matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
		.matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
		.matches(/[\W_]/).withMessage('Password must contain at least one special character'),
];

const loginValidator = [
	body('username')
		.trim()
		.notEmpty().withMessage('Username is required'),
	body('password')
		.notEmpty().withMessage('Password is required'),
];

const updateUserDataValidator = [
	...registerValidator, 
	body('current_password')
		.notEmpty().withMessage('Current Password is required'),
];

module.exports = {
	registerValidator,
	loginValidator,
	updateUserDataValidator,
};
