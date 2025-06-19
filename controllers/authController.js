import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const signup=async(req,res)=>{
    try{
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    const designation = req.body.designation?.trim().toLowerCase();

    const hashedPassword=await bcrypt.hash(password,5);

    const newUser=new User({name,email,password:hashedPassword,roleRef,designation});
    await newUser.save();
    console.log("User registered succesfully");
    return res.status(201).json({message:"User Registered Succesfully"});
    }catch(err){
        console.log("Signup error",err);
        return res.status(500).json({error:'Server Error'});
    } 
}

export const login=async(req,res)=>{
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim(); 

    if(!email || !password){
        return res.status(401).json({error:"Email and Password is required"});
    }
    try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email is not registered' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    console.log("User Logged In");
    const token=jwt.sign({name:user.name,email:user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
    return res.status(200).json({message: 'Login successful',token});
    }catch(err){
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}