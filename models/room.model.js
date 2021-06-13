import mongoose, { Schema } from 'mongoose';

const roomSchema = new mongoose.Schema({
  room: {
    type: String,
    trim: true,
    required: true,
  },
  users: {
    type: [String],
  },
});

export const Room = mongoose.model('room', roomSchema);
