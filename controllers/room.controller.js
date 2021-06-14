import { getRoomByUsers, Room } from '../models/room.model';
import { io } from '../server';

export const getRoomByUsersCtl = async (req, res, next) => {
  let users = [req.query.user1, req.query.user2];
  let room = await getRoomByUsers(users);
  if (room) {
    return res.json({
      data: room,
      errorStatus: false,
    });
  }
  return res.json({
    data: null,
    errorStatus: true,
  });
};
