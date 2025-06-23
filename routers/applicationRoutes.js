import express from 'express';
import { createApplication, deleteApplication, listApplication ,downloadApplications } from '../controllers/applicationController.js';
import { validateApplication } from '../middlewares/validateApplication.js';

const router=express.Router();

router.get('/',listApplication);
router.post('/create',validateApplication,createApplication);
router.delete('/delete/:id',deleteApplication);
router.get('/download',downloadApplications);

export default router;