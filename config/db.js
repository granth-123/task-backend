import mongoose from 'mongoose';

const connectDb=async(req,res)=>{
    try{
        const connection=await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database");
    }catch{
        console.log("Couldn't connect to database");
    }
}

export default connectDb;