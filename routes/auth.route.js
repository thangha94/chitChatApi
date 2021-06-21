import express from 'express';
import { signup, signin, verifyToken } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/checkToken', verifyToken);
router.get('/', (req, res, next) => {
  res.cookie('room', '123213');
  res.send({ some: 'json' });
});

export default router;
