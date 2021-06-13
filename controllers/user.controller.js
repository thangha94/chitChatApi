import { User } from '../models/user.model';
import mongoose from 'mongoose';
export const getAllUsers = async (req, res, next) => {
  let users = await User.find({
    _id: { $ne: mongoose.Types.ObjectId(req.user._id) },
  })
    .select('userName')
    .exec();
  return res.json({ data: users, errorStatus: false });
};
