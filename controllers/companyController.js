import Company from "../models/companyModel.js";
import mongoose from "mongoose";
import Application from "../models/applicationModel.js";

export const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    console.log(`Company ${req.body.businessName} Created`);
    return res
      .status(201)
      .json({ message: `Company ${req.body.businessName} Created` });
  } catch (err) {
    console.log("Error creating company:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: "Invalid company ID format" });
    }
    const toBeDeletedCompany = await Company.findByIdAndDelete(companyId);
    if (!toBeDeletedCompany) {
      return res
        .status(400)
        .json({ error: "The company you are trying to delete doesn't exist" });
    }

    await Application.deleteMany({ companyRef: companyId });
    console.log(`${toBeDeletedCompany.businessName} is deleted`);
    return res
      .status(200)
      .json({ message: `${toBeDeletedCompany.businessName} is deleted` });
      
  } catch (err) {
    console.log("Error deleting company:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const listCompany = async (req, res) => {
  try {
    const { page = 1, limit = 3, startDate } = req.query;
    const endDate = req.query.endDate || new Date();
    const filter = {};
    const skip = parseInt(page - 1) * parseInt(limit);
    if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const companies = await Company.find(filter)
      .select("-_id -__v")
      .populate({
        path: "userRef",
        select: "-password -_id -__v",
        populate: {
          path: "roleRef",
          select: "name -_id", 
        },
      })
      .populate("applicationId", "-_id -__v -companyRef")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    return res.status(200).json(companies);
  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
