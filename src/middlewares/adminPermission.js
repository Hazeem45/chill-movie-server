module.exports = (req, res, next) => {
	const { role } = req.token;

	const roleName = {
		admin: 1,
		user: 2,
	};

	if (role !== roleName.admin) {
		return res.status(403).json({ message: 'You do not have permission to access this resource' });
	}
	next();
};
