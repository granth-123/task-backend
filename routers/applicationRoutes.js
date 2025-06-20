import express from 'express';
import { createApplication, deleteApplication, listApplication } from '../controllers/applicationController.js';
import { validateApplication } from '../middlewares/validateApplication.js';

const router=express.Router();

router.get('/',listApplication);
router.post('/create',validateApplication,createApplication);
router.delete('/delete/:id',deleteApplication);

export default router;