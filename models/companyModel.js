import mongoose from 'mongoose';

const companySchema=new mongoose.Schema({
    businessName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    address:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    userRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    GSTIN:{
        type:String,
        trim:true
    },
    PAN:{
        type:String,
        trim:true
    },
    incorporationDate:{
        type:Date
    },
    CIN:{
        type:String,
        trim:true
    },
    activeAddress: {
    type: String,
    trim: true
  },
  registerAddress: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  applicationId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && new Set(arr.map(String)).size === arr.length;
      },
      message: 'Duplicate application references are not allowed'
    }
  }]
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;