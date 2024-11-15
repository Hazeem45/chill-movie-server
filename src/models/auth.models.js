const database = require('../../database/connection');

class AuthModels {
	// updateAuthToken = async (user_id, token) => {
	// 	const [result] = await database.query('UPDATE auth SET token = ? WHERE user_id = ?', [token, user_id]);
	// 	console.log(result);
	// };

	findToken = async (token) => {
		const [result] = await database.query('SELECT * FROM auth WHERE token = ?', [token]);
		return result.length ? result[0] : null;
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
}

module.exports = new AuthModels();
