const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: process.env.SERVICE_EMAILER,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
});

module.exports = transporter;
