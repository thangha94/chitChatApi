import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: true,
    max: 64,
  },
  password: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  is2FAEnabled: {
    type: Boolean,
  },
});

export const User = mongoose.model('user', userSchema);
