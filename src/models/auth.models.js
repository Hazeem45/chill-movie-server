const database = require('../../database/connection');

class AuthModels {
	findRefreshToken = async (token) => {
		const [result] = await database.query('SELECT * FROM auth WHERE token = ?', [token]);
		return result.length ? result[0] : null;
	};

	getRefreshTokensByUserId = async (userId) => {
		const [result] = await database.query('SELECT * FROM auth WHERE user_id = ?', [userId]);
		return result.length ? result : null;
	};

	saveRefreshToken = async (userId, token) => {
		const [result] = await database.query('INSERT INTO auth (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 6 MONTH))', [
			userId,
			token,
		]);
		return result.insertId;
	};

	deleteRefreshToken = async (token) => {
		await database.query('DELETE FROM auth WHERE token = ?', [token]);
	};

	deleteRefreshTokenByTokenId = async (tokenId) => {
		await database.query('DELETE FROM auth WHERE id = ?', [tokenId]);
	};

	deleteExpiredTokensByUserId = async (userId) => {
		await database.query('DELETE FROM auth WHERE expires_at < NOW() AND user_id = ?', [userId]);
	};
}

module.exports = new AuthModels();
