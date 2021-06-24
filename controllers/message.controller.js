import { Message } from '../models/message.model.js';
import mongoose from 'mongoose';
import { io } from '../server.js';
import { getDirectRoomByUsers, Room } from '../models/room.model.js';

export const receiveMessage = async (socket, data, user) => {
  // If this is a direct message: check whether db has the room includes 2 users
  // Create new room or go to next step
  // Save the message to message
  // Send new message to client
  let room = false;
  try {
    if (data.type === 'direct') {
      room = await getDirectRoomByUsers([
        mongoose.Types.ObjectId(data.id),
        mongoose.Types.ObjectId(user._id),
      ]);
      // if the room didn't exist then create new room
      if (!room || room.length === 0) {
        room = new Room({
          name: '',
          users: [
            mongoose.Types.ObjectId(data.id),
            mongoose.Types.ObjectId(user._id),
          ],
        });
        let roomNew = await room.save();
        if (!roomNew) {
          console.log('Get error when create Room');
          return false;
        }
        socket.join(roomNew._id.toString());
        io.to(data.id.toString()).emit('Server-join-room', {
          roomId: mongoose.Types.ObjectId(roomNew._id),
        });
        room = roomNew;
      }
    } else {
      let roomNew = await Room.findOne({
        _id: mongoose.Types.ObjectId(data.id),
      });
      room = roomNew;
    }
  } catch (error) {
    console.log(error);
  }

  if (room) {
    // Update the latest update for a room
    room.updated = new Date();
    room.save();

    let newMessage = new Message({
      content: data.content,
      room: room._id,
      user: user._id,
    });
    newMessage.save((err, message) => {
      if (err) {
        io.to(room._id.toString()).emit('Server-send-data', {
          data: { details: [err] },
          errorStatus: true,
        });
      } else {
        io.to(room._id.toString()).emit('Server-send-data', {
          data: { ...data, user },
          roomId: room._id.toString(),
          errorStatus: false,
        });
      }
    });
  } else {
    console.log('Please recheck the Room');
  }
};

export const getMessagesByRoom = async (req, res, next) => {
  let { room } = req.query;
  let messages = await Message.find({
    room: mongoose.Types.ObjectId(room),
  })
    .populate('room', '_id')
    .populate('user', 'userName');
  if (messages) {
    return res.json({
      data: messages,
      errorStatus: false,
    });
  }
  return res.json({
    data: null,
    errorStatus: true,
  });
};
