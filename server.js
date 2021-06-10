require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// have to use multer package to handle multipart/form-data
var multer = require('multer');
const authRoute = require('./routes/auth.route');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     let extArr = file.originalname.split('.');
//     let ext = '';
//     if (extArr.length > 1) {
//       ext = '.' + extArr[extArr.length - 1];
//     }
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   },
// });

// function fileFilter(req, file, cb) {
//   // The function should call `cb` with a boolean
//   // to indicate if the file should be accepted

//   // To reject this file pass `false`, like so:
//   cb(null, false);

//   // To accept the file pass `true`, like so:
//   cb(null, true);

//   // You can always pass an error if something goes wrong:
//   // cb(new Error("I don't have a clue!"));
// }

// var upload = multer({ storage: storage, fileFilter });
var upload = multer();
//  Define cookieParser middleware to set or get the cookie
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
    credentials: true,
  })
);
// Use .json to parse the payload from post data in {}
app.use(express.json());
// Use urlEncode to parse the payload form post data in x-www-form-urlecoded
app.use(express.urlencoded({ extended: false }));
// app.post('/profile', upload.single('avatar'), (req, res, next) => {
//   console.log(req.body);
//   // res.send('hello');
//   // const file = req.file;
//   // if (!file) {
//   //   const error = new Error('Please upload a file');
//   //   error.httpStatusCode = 400;
//   //   return next(error);
//   // }
//   // res.send(file);
//   res.redirect('http://localhost:3000/login');
// });
app.use('/auth', authRoute);

app.listen(process.env.PORT);
