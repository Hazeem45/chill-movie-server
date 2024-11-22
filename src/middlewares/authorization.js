const jwt = require('jsonwebtoken');
const authModels = require('../models/auth.models');
const usersModels = require('../models/users.models');

module.exports = async (req, res, next) => {
	const { authorization } = req.headers;
	const { refreshToken } = req.cookies;

	try {
		if (!authorization || !refreshToken) {
			return res.status(401).json({ message: 'Token not provided' });
		}

		const tokenType = authorization.split(' ')[0];
		if (tokenType !== 'Bearer') {
			return res.status(400).json({ message: 'Invalid token type' });
		}

		const token = authorization.split(' ')[1];
		const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		if (decodedAccessToken.userId !== decodedRefreshToken.userId || decodedAccessToken.role !== decodedRefreshToken.role) {
			return res.status(403).json({ message: 'Payload mismatch between access token and refresh token' });
		}

		const storedToken = await authModels.findRefreshToken(refreshToken);

		if (!storedToken) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		const { username } = await usersModels.getUserById(decodedAccessToken.userId);

		req.token = {
			...decodedAccessToken,
			username,
		};

		next();
	} catch (error) {
		return res.status(401).json({
			code: 401,
			message: 'Unauthorized',
			error,
		});
	}
};
