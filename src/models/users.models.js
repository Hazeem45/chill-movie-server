const database = require('../../database/connection');

class UsersModels {
	getRegisteredEmail = async (email) => {
		const [result] = await database.query('SELECT email FROM users WHERE email = ? ', [email]);
		return result.length ? result[0].email : null;
	};

	createUser = async (username, email, hashedPassword) => {
		const [result] = await database.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
		if (result.affectedRows) {
			return result.insertId;
		} else {
			return null;
		}
	};

	getUserById = async (id) => {
		const [result] = await database.query('SELECT * FROM users WHERE id = ? ', [id]);
		return result.length ? result : null;
	};

	getExistingUserByUsername = async (username) => {
		const [result] = await database.query('SELECT id, username, password, role_id FROM users WHERE username = ? LIMIT 1', [username]);
		return result.length ? result[0] : null;
	};
}

module.exports = new UsersModels();
