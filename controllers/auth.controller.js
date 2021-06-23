import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import registerValidation from '../auth/validation.js';
import { sendMessageUpdateUser } from '../socket.config.js';
// import { delete } from '../routes/auth.route';

export const signup = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.json({ data: error, errorStatus: true });
  }

  const { userName, email, password } = req.body;

  // Check whether the email was existed in DB
  let user = await User.findOne({ email }).exec();
  if (user) {
    return res.json({
      data: { details: [{ message: 'User with this email already exists' }] },
      errorStatus: true,
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);
  let newUser = new User({
    userName,
    email,
    password: hashPass,
    status: false,
  });
  newUser.save(async (err, user) => {
    if (err) {
      return res.json({ data: { details: [err] }, errorStatus: true });
    }
    await sendMessageUpdateUser();
    return res.json({ data: 'Signup success!' });
  });
};
const verify = async (token) => {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const user = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  return user;
};
export const signin = async (req, res) => {
  const { email, password, googleToken } = req.body;
  if (googleToken) {
    try {
      let googleUser = await verify(googleToken);
      let email = googleUser.payload.email;

      // Return token if email already exists else create new
      let user = await User.findOne({ email }).exec();
      if (user) {
        const tokenId = jwt.sign({ user: user }, process.env.SECRET_TOKEN, {
          expiresIn: '8 hours',
        });
        return res.json({
          data: { user, tokenId },
          errorStatus: false,
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(123456, salt);
        let newUser = new User({ userName, email, password: hashPass });
        newUser.save((err, user) => {
          if (err) {
            return res.json({ data: { details: [err] }, errorStatus: true });
          }
          const tokenId = jwt.sign(
            { user: newUser },
            process.env.SECRET_TOKEN,
            {
              expiresIn: '8 hours',
            }
          );
          user = user.toObject();
          delete user.password;
          return res.json({
            data: { user, tokenId },
            errorStatus: false,
          });
        });
      }
    } catch (err) {
      return res.json({
        data: {
          details: [{ message: 'Please recheck your Google account' }, { err }],
        },
        errorStatus: true,
      });
    }
  } else {
    let user = await User.findOne({ email })
      .select('userName email password')
      .exec();
    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.json({
          data: { details: [{ message: 'Password incorrect' }] },
          errorStatus: true,
        });
      }
      // user = user.toObject();
      // delete user.password;
      const tokenId = jwt.sign({ user }, process.env.SECRET_TOKEN, {
        expiresIn: '8 hours',
      });
      return res.json({
        data: { user, tokenId },
        errorStatus: false,
      });
    } else {
      return res.json({
        data: { details: [{ message: 'Username incorrect', user }] },
        errorStatus: true,
      });
    }
  }
};
export const verifyToken = async (req, res) => {
  try {
    let { tokenId } = req.body;
    let user = jwt.verify(tokenId, process.env.SECRET_TOKEN);
    return res.json(user);
  } catch (error) {
    return res.json({
      data: { details: [error] },
      errorStatus: true,
    });
  }
};
