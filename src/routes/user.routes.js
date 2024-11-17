const express = require('express');
const userController = require('../controllers/user.controller');
const adminPermission = require('../middlewares/adminPermission');
const authorization = require('../middlewares/authorization');
const router = express.Router();

router.post('/update-user-data', authorization, userController.updateUserData);
router.post('/create-admin', authorization, adminPermission, userController.createNewAdmin);
router.get('/all-users', authorization, adminPermission, userController.getAllUsers);
router.get('/all-admins', authorization, adminPermission, userController.getAllAdministrators);

module.exports = router;
