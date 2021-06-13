const express = require('express');
const { checkToken } = require('../auth/checkToken');
const { getAllUsers } = require('../controllers/user.controller');
const router = express.Router();

router.get('/allUsers', checkToken, getAllUsers);

module.exports = router;
