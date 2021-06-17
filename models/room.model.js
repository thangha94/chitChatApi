import mongoose, { Schema } from 'mongoose';
import { io } from '../server';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // required: true,
  },
  desc: {
    type: String,
    trim: true,
    // required: true,
  },
  users: {
    type: [String],
  },
  updated: { type: Date, default: Date.now },
});

export const Room = mongoose.model('room', roomSchema);

export const getRoomsByUser = async (user) => {
  let rooms = await Room.find({
    users: { $in: user },
  })
    .select('name users updated')
    .sort({ updated: -1 })
    .exec();
  return rooms;
};

export const getRoomsRecent = async (user) => {
  let rooms = await Room.find({
    users: { $in: user },
  })
    .select('name users updated')
    .sort({ updated: -1 })
    .limit(3)
    .exec();
  return rooms;
};

export const getDirectRoomByUsers = async (users) => {
  let room = await Room.findOne({ users: { $all: users }, name: '' });
  return room;
};
