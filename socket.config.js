import jwt from 'jsonwebtoken';
import { io } from './server';
import { receiveMessage } from './controllers/message.controller';
const socketConnection = (socket) => {
  let tokenId = socket.handshake.query.tokenId;
  try {
    let user = jwt.verify(tokenId, process.env.SECRET_TOKEN);
    socket.on('Client-normal-message', (data) => receiveMessage(socket, data));
  } catch (error) {
    console.log('Connection Error: ', error);
  }
};

module.exports = socketConnection;
