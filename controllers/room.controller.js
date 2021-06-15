import { getRoomByUsers, getRoomsByUser, Room } from '../models/room.model';
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

export const createNewRoom = async (req, res, next) => {
  const { name, users } = req.body;
  let newRoom = new Room({
    name,
    users,
  });
  let result = await newRoom.save();
  users.map((item) => {
    io.to(item).emit('Server-created-new-room', result);
  });
  return res.json({
    data: result,
    errorStatus: false,
  });
};

export const getAllRoomByUser = async (req, res, next) => {
  const { userId } = req.query;
  const rooms = await getRoomsByUser(userId);
  return res.json({
    data: rooms,
    errorStatus: false,
  });
};
