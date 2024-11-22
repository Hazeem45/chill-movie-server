const express = require('express');
const authorization = require('../middlewares/authorization');
const adminPermission = require('../middlewares/adminPermission');
const validation = require('../middlewares/validation');
const { updateUserDataValidator, registerValidator } = require('../validations/validators');
const multerUpload = require('../middlewares/multerUpload');
const router = express.Router();
const {
	updateUserData,
	createNewAdmin,
	getAllUsers,
	getAllAdministrators,
	setProfilePicture,
	showPicture,
	getPictureURL,
} = require('../controllers/user.controller');

router.post('/update-user-data', authorization, updateUserDataValidator, validation, updateUserData);
router.post('/upload-picture', authorization, multerUpload, setProfilePicture);
router.get('/picture', authorization, showPicture);
router.get('/picture-url', authorization, getPictureURL);
router.post('/create-admin', authorization, adminPermission, registerValidator, validation, createNewAdmin);
router.get('/all-users', authorization, adminPermission, getAllUsers);
router.get('/all-admins', authorization, adminPermission, getAllAdministrators);

module.exports = router;
