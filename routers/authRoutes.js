import express from 'express';
const router=express.Router();
import {signup,login} from '../controllers/authController.js';
import { validateSignUp } from '../middlewares/validateSignup.js';
import { forgotPassword,resetPassword } from '../controllers/passwordContoller.js';
router.post('/signup',validateSignUp,signup);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);

export default router;
