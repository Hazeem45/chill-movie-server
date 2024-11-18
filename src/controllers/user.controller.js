const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersModels = require('../models/users.models');

class UserControllers {
	updateUserData = async (req, res) => {
		const { username, password, current_password } = req.body;
		const { userId } = req.token;

		try {
			const response = await usersModels.getStoredPasswordByUserId(userId);
			const isPasswordValid = await bcrypt.compare(current_password, response.password);
			if (!isPasswordValid) {
				return res.status(401).json({
					code: 401,
					message: 'Password is incorrect!',
				});
			}

			const isUsernameUnchanged = username === response.username || !username;
			const isPasswordUnchanged = !password || (await bcrypt.compare(password, response.password));

			if (isUsernameUnchanged && isPasswordUnchanged) {
				return res.status(200).json({
					code: 200,
					message: 'No changes detected in user data.',
				});
			}

			let hashedPassword;
			if (password) {
				hashedPassword = await bcrypt.hash(password, 10);
			} else {
				hashedPassword = response.password;
			}

			const newUsername = username || response.username;

			await usersModels.updateUserDataByUserId(newUsername, hashedPassword, userId);

			return res.status(200).json({
				code: 200,
				message: 'User data updated successfully!',
			});
		} catch (error) {
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};

	createNewAdmin = async (req, res) => {
		const { username, password } = req.body;
		const { role } = req.token;

		try {
			const hashedPassword = await bcrypt.hash(password, 10);

			const existingUsername = await usersModels.getExistingUserByUsername(username);
			if (existingUsername) {
				return res.status(409).json({
					code: 409,
					message: 'Username is not available!',
				});
			}

			const responseId = await usersModels.createUser(username, hashedPassword, role);
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

	getAllUsers = async (req, res) => {
		const { userId, role } = req.token;

		try {
			const response = await usersModels.getAllUsers();

			return res.status(200).json({
				accessors: { userId, role },
				users_list: response,
			});
		} catch (error) {
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};

	getAllAdministrators = async (req, res) => {
		const { userId, role } = req.token;

		try {
			const response = await usersModels.getAllAdmin();

			return res.status(200).json({
				accessors: { userId, role },
				admin_list: response,
			});
		} catch (error) {
			return res.status(500).json({ message: 'An internal server error occurred', error });
		}
	};
}

module.exports = new UserControllers();
