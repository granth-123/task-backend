import express from 'express';
import { createCompany,deleteCompany,listCompany } from '../controllers/companyController.js';
import { validateCompany } from '../middlewares/validateCompany.js';
const router=express.Router();

router.post("/create",validateCompany,createCompany);
router.delete("/delete/:id",deleteCompany);
router.get("/",listCompany);

export default router;