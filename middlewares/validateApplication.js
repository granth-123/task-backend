import { applicationValidate } from "../validations/applicationValidation.js";
import Application from "../models/applicationModel.js";
import Company from "../models/companyModel.js";
import mongoose from 'mongoose';

export const validateApplication=async(req,res,next)=>{
    const {value,error}=applicationValidate(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message});
    }
    try{
        if (!mongoose.Types.ObjectId.isValid(value.companyRef)) {
        return res.status(400).json({ error: "Invalid company ID format" });
        }
        const existingCompany=await Company.findById(value.companyRef);
        if(!existingCompany){
            return res.status(400).json({error:"Company you're trying to refer doesn't exist"});
        }
        req.body=value;

    }catch(err){
        console.log("Server Error:",err);
        return res.status(500).json({error:"Server Error"});
    }
    next();
}
