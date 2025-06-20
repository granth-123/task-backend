import Company from "../models/companyModel.js";
import mongoose from "mongoose";

export const createCompany=async(req,res)=>{
    try{
        const company=new Company(req.body);
        await company.save();
        console.log(`Company ${req.body.businessName} Created`);
        return res.status(201).json({message:`Company ${req.body.businessName} Created`});
    }catch(err){
       console.log('Error creating company:', err);
       return res.status(500).json({ error: 'Server error' });
    }
};

export const deleteCompany=async(req,res)=>{
    try{
        const companyId=req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({ error: 'Invalid company ID format' });
        }
        const toBeDeletedCompany=await Company.findByIdAndDelete(companyId);
        if(!toBeDeletedCompany){
            return res.status(400).json({error:"The company you are trying to delete doesn't exist"});
        }
        console.log(`${toBeDeletedCompany.businessName} is deleted`);
        return res.status(200).json({message:`${toBeDeletedCompany.businessName} is deleted`});
    }catch(err){
        console.log("Error deleting company:",err);
        return res.status(500).json({error:"Server Error"});
    }
}

export const listCompany=async(req,res)=>{
    try{
        const {page=1,limit=2,startDate}=req.query;
        const endDate = req.query.endDate || new Date();    
        const filter={};
        const skip=(parseInt(page-1))*parseInt(limit);
        if(startDate){
            filter.createdAt={
                $gte:new Date(startDate),
                $lte:new Date(endDate)
            };
        }
        const companies = await Company.find(filter)
        .select('-_id -__v') 
        .populate('userRef', '-password -__v') 
        .populate('applicationId','-_id')
        .sort({createdAt:-1})
        .skip(skip)
        .limit(parseInt(limit));
        return res.status(200).json(companies);
    }catch(err){
        console.log("Server Error:",err);
        res.status(500).json({error:"Server Error"});
    }
}

// export const listApplications = async (req, res) => {
//   try {
//     const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

//     const filter = {};
//     if (status) filter.status = status;
//     if (startDate && endDate) {
//       filter.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     const applications = await Application.find(filter)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .populate('companyRef');

//     res.status(200).json({ applications });
//   } catch (err) {
//     console.error('Error listing applications:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
// export const deleteApplication = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedApp = await Application.findByIdAndDelete(id);
//     if (!deletedApp) {
//       return res.status(404).json({ error: 'Application not found' });
//     }
//     res.status(200).json({ message: 'Application deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting application:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
