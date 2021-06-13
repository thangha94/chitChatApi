require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
// const messageRoute = require('./routes/message.route');
const socketConnection = require('./socket.config');
const { checkToken } = require('./auth/checkToken');

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
    origin: 'http://localhost:3000',
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
// app.use('/message', checkToken, messageRoute);
// Start pure express App
// app.listen(process.env.PORT);

// Config and start Socket IO server includes express features
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', socketConnection);

server.listen(process.env.PORT, () => {
  console.log('Server listening on :' + process.env.PORT);
});

module.exports.io = io;
