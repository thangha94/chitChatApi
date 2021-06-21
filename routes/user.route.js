import express from 'express';
import { checkToken } from '../auth/checkToken.js';
import { getAllUsers } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/allUsers', checkToken, getAllUsers);

export default router;
