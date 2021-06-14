import { User } from '../models/user.model';
import mongoose from 'mongoose';
export const getAllUsers = async (req, res, next) => {
  let users = await User.find({
    // _id: { $ne: mongoose.Types.ObjectId(req.user._id) },
  })
    .select('userName email status')
    .exec();
  return res.json({ data: users, errorStatus: false });
};

export const updateStatusUser = async (id, status) => {
  try {
    let user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    user.status = status;
    let save = await user.save();
    return true;
  } catch (error) {
    return false;
  }
};
