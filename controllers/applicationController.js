import Application from '../models/applicationModel.js';
import mongoose from 'mongoose';
import {nanoid} from 'nanoid';
import Company from '../models/companyModel.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

export const createApplication=async(req,res)=>{
    try{
        const {companyRef,referredBy,financeType,leadSource}=req.body;
        const applicationId = nanoid(10); 
        const applicationNo = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const existing = await Application.findOne({
        companyRef,
        financeType,
        leadSource,
        referredBy
        });

        if (existing) {
        return res.status(400).json({ error: 'An identical application already exists.' });
        }

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
    .populate('companyRef','-_id -__v -applicationId -userRef')
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
        
        await Company.findByIdAndUpdate(existingApplication.companyRef, {
            $pull: { applicationId: existingApplication._id }
        });
        console.log(`Application with ${applicationId} deleted`);
        return res.status(200).json({message:`Application with id${applicationId} deleted`})
        }catch(err){
        console.log("Server Error",err);
        return res.status(500).json({error:"Server Error"});
    }
}

export const downloadApplications=async(req,res)=>{
    try{
        const applications=await Application.find({status:"Approved"})
        .populate('companyRef','businessName address');

        // if(applications.length===0){
        //     return res.status(404).json({error:"No approved applications found"});
        // }

        const data = applications.map(app => ({
        ApplicationID: app.applicationId,
        ApplicationNo: app.applicationNo,
        Company: app.companyRef?.businessName || 'N/A',
        ReferredBy: app.referredBy,
        FinanceType: app.financeType,
        LeadSource: app.leadSource,
        Status: app.status,
        CreatedAt: app.createdAt.toISOString().split('T')[0],
        }));

        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Approved Applications');

        const exportDir = path.join('exports');
        const filename = `approved_applications.xlsx`;
        const filepath = path.join(exportDir, filename);
        if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
        }
        xlsx.writeFile(workbook, filepath);
        console.log("File saved to:", filepath);
        res.status(200).json({ message: "Excel file saved"});
        // const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // res.setHeader('Content-Disposition', 'attachment; filename=approved-applications.xlsx');
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // res.send(buffer);

    }catch(error){
        console.log("Server Error:",error);
        return res.status(500).json({error:"Server Error"});
    }
}