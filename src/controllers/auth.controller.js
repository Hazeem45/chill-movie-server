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
			return res.status(500).json({ error });
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

			const accessToken = jwt.sign({ userId: existUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

			const refreshToken = jwt.sign({ userId: existUser.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '180d' });

			const MAX_REFRESH_TOKENS = 3;
			const tokens = await authModels.getRefreshTokensByUserId(existUser.id);

			if (tokens.length >= MAX_REFRESH_TOKENS) {
				const oldestToken = tokens[0];
				await authModels.deleteRefreshTokenByTokenId(oldestToken.id);
			}

			await authModels.saveRefreshToken(existUser.id, refreshToken);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
				maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
			});

			return res.status(200).json({ accessToken });
		} catch (error) {
			return res.status(500).json({ error });
		}
	};

	refreshAccessToken = async (req, res) => {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(401).json({ message: 'Refresh token is missing' });
		}

		try {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

			const storedToken = await authModels.findRefreshToken(refreshToken);
			if (!storedToken) {
				return res.status(401).json({ message: 'Invalid refresh token' });
			}

			const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

			return res.status(200).json({ accessToken: newAccessToken });
		} catch (error) {
			return res.status(401).json({ error });
		}
	};

	logoutUser = async (req, res) => {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(204).send();
		}

		try {
			await authModels.deleteRefreshToken(refreshToken);

			res.clearCookie('refreshToken', {
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
			});
			return res.status(200).json({ message: 'Logged out successfully' });
		} catch (error) {
			return res.status(500).json({ error });
		}
	};
}

module.exports = new AuthControllers();
