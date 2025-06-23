import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Company from "./models/companyModel.js";
import Application from "./models/applicationModel.js";
import Role from "./models/roleModel.js"; 
import { nanoid } from "nanoid";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const results = [];

    for (let row of data) {
      try {
        const {
        name,
        email,
        password,
        role,
        designation,
        businessName,
        address,
        GSTIN,
        PAN,
        incorporationDate,
        CIN,
        activeAddress,
        registerAddress,
        state,
        city,
        referredBy,
        financeType,
        leadSource
      } = row;
        if (!name || !email || !password || !businessName || !address || !GSTIN) {
          results.push({ row, error: "Missing required fields" });
          continue;
        }
        
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          let roleRefs = [];

          if (role) {
            const foundRole = await Role.findOne({ name: role.trim().toLowerCase() });
            if (foundRole) {
              roleRefs.push(foundRole._id);
            }
          }
          user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            designation,
            roleRef: roleRefs,
          });
          await user.save();
        }

        let company = await Company.findOne({ GSTIN });
        if (!company) {
          company = new Company({
            businessName,
            address,
            GSTIN,
            PAN,
            userRef: user._id,
            incorporationDate,
            CIN,
            activeAddress,
            registerAddress,
            state,
            city
          });
          await company.save();
        }

        const existingApplication = await Application.findOne({
          companyRef: company._id,
          financeType,
          leadSource,
          referredBy,
        });
        if (existingApplication) {
          results.push({ row, warning: "Duplicate application skipped" });
          continue;
        }

        const applicationId = nanoid(10);
        const applicationNo = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const application = new Application({
          applicationId,
          applicationNo,
          status: "Pending",
          companyRef: company._id,
          referredBy,
          financeType,
          leadSource,
        });
        await application.save();
        if (!company.applicationId.some(id => id.toString() === application._id.toString())) {
        company.applicationId.push(application._id);
        await company.save();
        }
        results.push({ row, status: "Success" });
      } catch (rowError) {
        results.push({ row, error: rowError.message });
      }
    }

    res.status(200).json({ message: "Bulk upload completed", results });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
