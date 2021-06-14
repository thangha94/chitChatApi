import mongoose, { Schema } from 'mongoose';
import { io } from '../server';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // required: true,
  },
  users: {
    type: [String],
  },
});

export const Room = mongoose.model('room', roomSchema);

export const getRoomsByUser = async (user) => {
  let rooms = await Room.find({
    users: { $in: user },
  })
    .select('name users')
    .exec();
  return rooms;
};

export const getRoomByUsers = async (users) => {
  let room = await Room.findOne({ users: { $all: users }, name: '' });
  return room;
};
