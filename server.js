import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const app = express();
import cors from 'cors';

import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRoute from './routes/auth.route.js';

import userRoute from './routes/user.route.js';
import roomRoute from './routes/room.route.js';
import messageRoute from './routes/message.route.js';
import { socketConnection } from './socket.config.js';
import { checkToken } from './auth/checkToken.js';

//  Config and connect to mongodb
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);

//  Define cookieParser middleware to set or get the cookie
app.use(cookieParser());

//  Config CORS to handle the CORS problem
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://chitchat.com',
      'http://hathang.online',
      'https://hathang.online',
    ],
    // methods: ['POST', 'GET'],
    credentials: true,
    // exposedHeaders: ['set-cookie'],
  })
);

//  Use .json to parse the payload from post data in {}
app.use(express.json());
//  Use urlEncode to parse the payload form post data in x-www-form-urlecoded
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/room', roomRoute);
app.use('/message', messageRoute);
// app.use('/message', checkToken, messageRoute);
// Start pure express App
// app.listen(process.env.PORT);

// Config and start Socket IO server includes express features
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://chitchat.com',
      'http://hathang.online',
      'https://hathang.online',
    ],
  },
});
// function requestFc() {
//   const https = require('https');
//   let result = '';
//   https
//     .get(
//       'https://jsonmock.hackerrank.com/api/stocks?date=5-January-2000',
//       (res) => {
//         res.on('data', (d) => {
//           result = d;
//           process.stdout.write(d);
//         });
//       }
//     )
//     .on('error', (e) => {
//       console.error(e);
//     });
//   return result;
// }

// console.log(requestFc());

io.on('connection', socketConnection);

server.listen(process.env.PORT, () => {
  console.log('Server listening on :' + process.env.PORT);
});

export { io };
