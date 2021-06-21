import express from 'express';
import { checkToken } from '../auth/checkToken.js';
import {
  getAllRoomByUser,
  getRecentRooms,
} from '../controllers/room.controller.js';
import {
  getRoomByUsersCtl,
  createNewRoom,
} from '../controllers/room.controller.js';
const router = express.Router();

router.get('/getByUsers', checkToken, getRoomByUsersCtl);
router.get('/getAllRoomByUser', checkToken, getAllRoomByUser);
router.get('/getRecentRooms', checkToken, getRecentRooms);
router.post('/createNewRoom', checkToken, createNewRoom);

export default router;
