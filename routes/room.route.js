const express = require('express');
const { checkToken } = require('../auth/checkToken');
const { getRoomByUsersCtl } = require('../controllers/room.controller');
const router = express.Router();

router.get('/getByUsers', checkToken, getRoomByUsersCtl);

module.exports = router;
