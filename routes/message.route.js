const express = require('express');
const { getMessagesByRoom } = require('../controllers/message.controller');
const router = express.Router();

router.get('/getMessagesByRoom', getMessagesByRoom);

module.exports = router;
