import mongoose, { Schema } from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'room',
    required: true,
  },
});

export const Message = mongoose.model('message', messageSchema);
