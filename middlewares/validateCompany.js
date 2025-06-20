import { companyValidate } from "../validations/companyValidation.js";
import Company from "../models/companyModel.js";
import User from "../models/userModel.js";

export const validateCompany=async(req,res,next)=>{
    const {value,error}=companyValidate(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message});
    }
    try{
        const existingCompany=await Company.findOne({
            $or:[
                {businessName:value.businessName},
                {GSTIN:value.GSTIN},
                {PAN:value.PAN},
                {CIN:value.CIN}
            ]});
        if(existingCompany) return res.status(400).json({error:"Company with this GST/PAN/CIN number already exists"});
        
        const existingUser=await User.findById(value.userRef);
        if(!existingUser){
            return res.status(400).json({error:"The referenced user does not exist"});
        }
    
    }catch(err){
        console.log("Server Error:",err);
        return res.status(500).json({error:"Server Error"});
    }
    next();
}