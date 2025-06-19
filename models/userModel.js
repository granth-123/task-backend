import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    roleRef:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Role',
        default: []
    }],
    designation:{
        type:String,
        trim:true,
        lowercase:true
    }
},
{ timestamps: true });

const User=mongoose.model('User',userSchema);
export default User;
