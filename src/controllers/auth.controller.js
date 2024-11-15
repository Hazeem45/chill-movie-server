const database = require('../../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModels = require('../models/auth.models');
const usersModels = require('../models/users.models');

class AuthControllers {
	registerUser = async (req, res) => {
		const { username, email, password } = req.body;
		try {
			const hashedPassword = await bcrypt.hash(password, 10);

			const existingUsername = await usersModels.getExistingUsername(username);
			if (existingUsername) {
				return res.status(409).json({
					code: 409,
					message: 'Username is not available!',
				});
			}

			const registeredEmail = await usersModels.getRegisteredEmail(email);
			if (registeredEmail) {
				return res.status(409).json({
					code: 409,
					message: 'Email is already registered!',
				});
			}

			const userID = await usersModels.createUser(username, email, hashedPassword);
			const userData = await usersModels.getUserById(userID);

			return res.status(201).json({
				code: 201,
				message: 'User registered successfully',
				data: userData,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send(error);
		}
	};

	loginUser = async (req, res) => {
		const { username, password } = req.body;

		try {
			const existUser = await usersModels.getExistingUsername(username);
			if (!existUser || !(await bcrypt.compare(password, existUser.password))) {
				return res.status(401).json({
					code: 401,
					message: 'Invalid username or password',
				});
			}

			const accessToken = jwt.sign(
				{
					userId: existUser.id,
				},
				process.env.JWT_SECRET_KEY,
				{
					expiresIn: '10m',
				},
			);

			const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '6 months' });

			await authModels.saveRefreshToken(user.id, refreshToken);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		} catch (error) {
			return res.status(500).send({ message: error.message });
		}
	};

	refreshAccessToken = async (req, res) => {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(401).json({ message: 'Refresh token missing' });
		}

		try {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

			const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

			res.status(200).json({ accessToken: newAccessToken });
		} catch (err) {
			res.status(403).json({ message: 'Invalid or expired refresh token' });
		}
	};

	logoutUser = async (req, res) => {
		const { refreshToken } = req.cookies;
		if (!refreshToken) {
			return res.status(204).send();
		}

		await authModels.deleteRefreshToken(refreshToken);

		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
		});
		res.status(200).json({ message: 'Logged out successfully' });
	};
}

module.exports = new AuthControllers();
