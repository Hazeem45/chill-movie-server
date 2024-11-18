const database = require('../../database/connection');

class UsersModels {
	getRegisteredEmail = async (email) => {
		const [result] = await database.query('SELECT email FROM users WHERE email = ? ', [email]);
		return result.length ? result[0].email : null;
	};

	createUser = async (username, hashedPassword, role = 2) => {
		const [result] = await database.query('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role]);
		if (result.affectedRows) {
			return result.insertId;
		} else {
			return null;
		}
	};

	getUserById = async (id) => {
		const [result] = await database.query('SELECT * FROM users WHERE id = ? ', [id]);
		result.forEach((user) => delete user.password);
		return result.length ? result[0] : null;
	};

	getStoredPasswordByUserId = async (id) => {
		const [result] = await database.query('SELECT password, username FROM users WHERE id = ? ', [id]);
		return result.length ? result[0] : null;
	};

	updateUserDataByUserId = async (username, hashedPassword, userId) => {
		await database.query('UPDATE users SET username = ?, password = ? WHERE id = ?;', [username, hashedPassword, userId]);
	};

	getExistingUserByUsername = async (username) => {
		const [result] = await database.query('SELECT id, username, password, role_id FROM users WHERE username = ? LIMIT 1', [username]);
		return result.length ? result[0] : null;
	};

	getAllUsers = async () => {
		const [result] = await database.query('SELECT * FROM users WHERE role_id = 2 ');
		result.forEach((user) => delete user.password);
		return result.length ? result : null;
	};

	getAllAdmin = async () => {
		const [result] = await database.query('SELECT * FROM users WHERE role_id = 1 ');
		result.forEach((user) => delete user.password);
		return result.length ? result : null;
	};
}

module.exports = new UsersModels();
