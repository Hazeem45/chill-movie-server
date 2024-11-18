const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModels = require('../models/auth.models');
const usersModels = require('../models/users.models');

class AuthControllers {
	registerUser = async (req, res) => {
		const { username, password } = req.body;

		try {
			const hashedPassword = await bcrypt.hash(password, 10);

			const existingUsername = await usersModels.getExistingUserByUsername(username);
			if (existingUsername) {
				return res.status(409).json({
					code: 409,
					message: 'Username is not available!',
				});
			}

			const responseId = await usersModels.createUser(username, hashedPassword);
			const userData = await usersModels.getUserById(responseId);

			return res.status(201).json({
				code: 201,
				message: 'User registered successfully',
				data: userData,
			});
		} catch (error) {
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};

	registerAdmin = async (req, res) => {
		const { username, password, privilege_key } = req.body;

		try {
			if (!privilege_key || privilege_key !== process.env.ADMIN_PRIVILEGE_KEY) {
				return res.status(403).json({
					code: 403,
					error: !privilege_key ? 'Privilege key is required' : 'Invalid privilege key',
					message: 'You do not have permission to access this resource',
				});
			}
			const hashedPassword = await bcrypt.hash(password, 10);

			const existingUsername = await usersModels.getExistingUserByUsername(username);
			if (existingUsername) {
				return res.status(409).json({
					code: 409,
					message: 'Username is not available!',
				});
			}

			const responseId = await usersModels.createUser(username, hashedPassword, 1);
			const adminData = await usersModels.getUserById(responseId);

			return res.status(201).json({
				code: 201,
				message: 'Successfully created new admin',
				data: adminData,
			});
		} catch (error) {
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};

	loginUser = async (req, res) => {
		const { username, password } = req.body;
		const tokenFromCookie = req.cookies.refreshToken;

		try {
			const existUser = await usersModels.getExistingUserByUsername(username);
			const isPasswordValid = existUser && (await bcrypt.compare(password, existUser.password));

			if (!existUser || !isPasswordValid) {
				return res.status(401).json({
					code: 401,
					message: 'Invalid username or password',
				});
			}

			await authModels.deleteExpiredTokensByUserId(existUser.id);

			if (tokenFromCookie) {
				const storedToken = await authModels.findRefreshToken(tokenFromCookie);
				if (storedToken) {
					await authModels.deleteRefreshTokenByTokenId(storedToken.id);
				}
			}

			const tokens = await authModels.getRefreshTokensByUserId(existUser.id);
			if (tokens) {
				const MAX_REFRESH_TOKENS = 3;

				if (tokens.length >= MAX_REFRESH_TOKENS) {
					const oldestToken = tokens[0];
					await authModels.deleteRefreshTokenByTokenId(oldestToken.id);
				}
			}

			const accessToken = jwt.sign(
				{
					userId: existUser.id,
					role: existUser.role_id,
				},
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '10m',
				},
			);

			const refreshToken = jwt.sign(
				{
					userId: existUser.id,
					role: existUser.role_id,
				},
				process.env.REFRESH_TOKEN_SECRET,
				{
					expiresIn: '180d',
				},
			);

			await authModels.saveRefreshToken(existUser.id, refreshToken);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
			});

			return res.status(200).json({ accessToken });
		} catch (error) {
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};

	refreshAccessToken = async (req, res) => {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(403).json({ message: 'Refresh token is missing' });
		}

		try {
			const storedToken = await authModels.findRefreshToken(refreshToken);
			if (!storedToken) {
				return res.status(403).json({ message: 'Invalid refresh token' });
			}

			if (new Date(storedToken.expires_at) < new Date()) {
				await authModels.deleteRefreshTokenByTokenId(storedToken.id);
				return res.status(403).json({ message: 'Refresh token expired' });
			}

			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

			const newAccessToken = jwt.sign(
				{
					userId: decoded.userId,
					role: decoded.role,
				},
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '10m',
				},
			);

			return res.status(200).json({ accessToken: newAccessToken });
		} catch (error) {
			return res.status(403).json({ message: 'Invalid or expired refresh token', error });
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
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};
}

module.exports = new AuthControllers();
