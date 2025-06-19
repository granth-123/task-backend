import mongoose from 'mongoose'

const applicationSchema= new mongoose.Schema({
    applicationId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
  companyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  referredBy: {
    type: String,
    trim: true
  },
  applicationNo: {
    type: String,
    required: true,
    unique: true
  }
},{timestamps:true});

const Application=mongoose.model('Application',applicationSchema);
export default Application;
