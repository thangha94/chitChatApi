import jwt from 'jsonwebtoken';
import { io } from './server';
import mongoose from 'mongoose';
import { receiveMessage } from './controllers/message.controller';
import { updateStatusUser } from './controllers/user.controller';
import { getRoomsByUser } from './models/room.model';
import { User } from './models/user.model';
export const socketConnection = async (socket) => {
  let tokenId = socket.handshake.query.tokenId;
  try {
    // Check the token expired
    // Join all off room to detect the message
    // Update status to true
    let user = jwt.verify(tokenId, process.env.SECRET_TOKEN);
    let rooms = await getRoomsByUser(user.user._id);
    let updateUser = await updateStatusUser(user.user._id, true);
    let sendMessage = await updateUsers();
    rooms.map((item) => {
      socket.join(item._id.toString());
    });
    socket.join(user.user._id.toString());
    socket.on('Client-normal-message', (data) =>
      receiveMessage(socket, data, user.user)
    );
    socket.on('Client-first-join-room', (data) => {
      socket.join(data.roomId.toString());
      io.to(data.roomId.toString()).emit('Server-send-new-room-data', {
        data,
        errorStatus: false,
      });
    });
    socket.on('disconnect-socket', async (reason) => {
      let updateUser = await updateStatusUser(user.user._id, false);
      let disSendMessage = await updateUsers();
    });
    // socket.on('disconnect', async (reason) => {
    //   let updateUser = await updateStatusUser(user.user._id, false);
    //   let disSendMessage = await updateUsers();
    //   console.log(
    //     'Disconnected with reason: ',
    //     reason,
    //     new Date().getTime(),
    //     user.user.userName,
    //     reason
    //   );
    // });
  } catch (error) {
    console.log('Connection Error: ', error);
  }
};

export const updateUsers = async () => {
  let users = await User.find({
    // _id: { $ne: mongoose.Types.ObjectId(req.user._id) },
  })
    .select('userName email status')
    .exec();
  io.sockets.emit('Server-update-users', users);
};

// module.exports.socketConnection = socketConnection;
