import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import {validateUser} from '../validations/userValidation.js';

export const validateSignUp=async(req,res,next)=>{
    const {error,value}=validateUser(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message});
    }
    try{
    const existingUser=await User.findOne({email:value.email});
    if(existingUser){
       return res.status(400).json({error:"User with this email exists"});
    }
    // if(value.roleRef!==undefined ){
    //     const roleCheck=await Role.findOne({roleRef:value.roleRef});
    //     if(!roleCheck){
    //         return res.status(400).json({error:"Role doesn't exist"})
    //     }
    // }
    }catch(err){
        console.log("Server Error:",err);
        return res.status(500).json({error:"Server Error"});
    }
    req.validatedUser = value
    next();
}

