import express from 'express';
const router=express.Router();
import {signup,login} from '../controllers/authController.js';
import { validateSignUp } from '../middlewares/validateSignup.js';
import { forgotPassword,resetPassword } from '../controllers/passwordContoller.js';
import { decryptBody } from '../middlewares/decryptBody.js';

router.post('/signup',decryptBody,validateSignUp,signup);
router.post('/login',decryptBody,login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',decryptBody,resetPassword);

export default router;
