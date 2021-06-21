import express from 'express';
import { getMessagesByRoom } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/getMessagesByRoom', getMessagesByRoom);

export default router;
