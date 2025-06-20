import Application from '../models/applicationModel.js';
import mongoose from 'mongoose';
import {nanoid} from 'nanoid';
import Company from '../models/companyModel.js'

export const createApplication=async(req,res)=>{
    try{
        const {companyRef,referredBy,financeType,leadSource}=req.body;
        const applicationId = nanoid(10); 
        const applicationNo = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const newApplication = new Application({
        applicationId,status: 'Pending',companyRef,referredBy,financeType,leadSource,applicationNo
        });
        await newApplication.save();

        const company=await Company.findById(companyRef);
        if (!company.applicationId.some(id => id.toString() === newApplication._id.toString()))  {
            company.applicationId.push(newApplication._id);
            await company.save();
        }

        console.log(`Application ${applicationNo} created`);
        return res.status(201).json({message: `Application created successfully`,applicationNo
        });
        }
    catch(err){
        console.log("Server Error:",err);
        res.status(500).json({error:"Server Error"});
    }  
}

export const listApplication=async(req,res)=>{
    try{
    const {page=1,limit=3,status}=req.query;
    const skip=(parseInt(page)-1)*parseInt(limit);

    const filter={};
    if(status){
        filter.status=status;
    }
    const applications=await Application.find(filter)
    .select('-_id -__v')
    .populate('companyRef','-_id -__v')
    .skip(skip)
    .limit(parseInt(limit));
    return res.status(200).json(applications);
    }catch(err){
        console.log("Server Error:",err);
        res.status(500).json({error:"Server Error"});
    }
}

export const deleteApplication=async(req,res)=>{
    try{
        const applicationId=req.params.id;
        const existingApplication=await Application.findOneAndDelete({applicationId:applicationId});
        if(!existingApplication){
            return res.status(400).json({error:"Application you are trying to refer doesn't exist"});
        }
        console.log(`Application with ${applicationId} deleted`);
        return res.status(200).json({message:`Application with ${applicationId} deleted`})

    }catch(err){
        console.log("Server Error",err);
        return res.status(500).json({error:"Server Error"});
    }
}