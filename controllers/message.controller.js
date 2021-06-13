import { Message } from '../models/message.model';
import { io } from '../server';

export const receiveMessage = async (socket, data) => {
  // Save the message to message
  // Send new message to client

  let newMessage = new Message({
    content: data.content,
    room: data.room,
    user: data.user,
  });
  newMessage.save((err, user) => {
    if (err) {
      console.log('case 1');
      socket.emit('Server-send-data', {
        data: { details: [err] },
        errorStatus: true,
      });
    } else {
      console.log('case 2');
      socket.emit('Server-send-data', {
        data,
        errorStatus: false,
      });
      //   io.to(data.room).emit('Server-send-data', {
      //     data,
      //     errorStatus: false,
      //   });
    }
  });
};
