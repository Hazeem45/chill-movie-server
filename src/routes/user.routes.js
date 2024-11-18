const express = require('express');
const authorization = require('../middlewares/authorization');
const adminPermission = require('../middlewares/adminPermission');
const validation = require('../middlewares/validation');
const { updateUserData, createNewAdmin, getAllUsers, getAllAdministrators } = require('../controllers/user.controller');
const { updateUserDataValidator, registerValidator } = require('../validations/validators');
const router = express.Router();

router.post('/update-user-data', authorization, updateUserDataValidator, validation, updateUserData);
router.post('/create-admin', authorization, adminPermission, registerValidator, validation, createNewAdmin);
router.get('/all-users', authorization, adminPermission, getAllUsers);
router.get('/all-admins', authorization, adminPermission, getAllAdministrators);

module.exports = router;
