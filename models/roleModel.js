import mongoose from 'mongoose';

const roleSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    }
},{timestamps:true})

const Role=mongoose.model('Role',roleSchema);
export default Role;