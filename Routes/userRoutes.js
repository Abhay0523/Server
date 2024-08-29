const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.post('/create', userController.createUser);
router.get('/getusers', userController.getUsers);
router.put('/deactivateuser/:id', userController.deactivateUser);
router.get('/getuser/:id', userController.getUserById);
router.patch('/updateuser/:id', userController.updateUser);

module.exports = router;
