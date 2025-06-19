import express from 'express';
const router=express.Router();
import {signup,login} from '../controllers/authController.js';
import { validateSignUp } from '../middlewares/validateSignup.js';

router.post('/signup',validateSignUp,signup);
router.post('/login',login);

export default router;
