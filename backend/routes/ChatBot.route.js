import express from 'express';
import { Message } from '../Controllers/ChatBot.msg.js';


const router = express.Router();

router.post("/message", Message)

export default router;
