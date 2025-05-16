const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/add', userController.addUser);
router.get('/', userController.getUsers);

module.exports = router;
