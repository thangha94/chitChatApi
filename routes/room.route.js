const express = require('express');
const { checkToken } = require('../auth/checkToken');
import {
  getAllRoomByUser,
  getRecentRooms,
} from '../controllers/room.controller';
const {
  getRoomByUsersCtl,
  createNewRoom,
} = require('../controllers/room.controller');
const router = express.Router();

router.get('/getByUsers', checkToken, getRoomByUsersCtl);
router.get('/getAllRoomByUser', checkToken, getAllRoomByUser);
router.get('/getRecentRooms', checkToken, getRecentRooms);
router.post('/createNewRoom', checkToken, createNewRoom);

module.exports = router;
