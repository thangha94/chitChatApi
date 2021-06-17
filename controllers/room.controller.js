import mongoose from 'mongoose';
import {
  getDirectRoomByUsers,
  getRoomsByUser,
  getRoomsRecent,
  Room,
} from '../models/room.model';
import { User } from '../models/user.model';
import { io } from '../server';

export const getRoomByUsersCtl = async (req, res, next) => {
  let users = [req.query.user1, req.query.user2];
  let room = await getDirectRoomByUsers(users);
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
  const { name, users, desc } = req.body;
  let newRoom = new Room({
    name,
    users,
    desc,
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

export const getRecentRooms = async (req, res, next) => {
  const { userId } = req.query;
  const rooms = await getRoomsRecent(userId);
  let newData = [];
  const asyncRes = await Promise.all(
    rooms.map(async (item, index) => {
      if (item.users.length <= 2) {
        return await Promise.all(
          item.users.map(async (user) => {
            return await User.findOne({
              _id: mongoose.Types.ObjectId(user),
            });
          })
        );
      } else {
        return null;
      }
    })
  );
  let adjustRooms = [...rooms];
  adjustRooms = adjustRooms.map((item, index) => {
    if (asyncRes[index] != null) {
      return { ...item.toObject(), userData: asyncRes[index] };
    } else {
      return item;
    }
  });
  return res.json({
    data: adjustRooms,
    errorStatus: false,
  });
};
