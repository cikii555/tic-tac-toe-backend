import mongoose  from "mongoose";
require('dotenv').config()

 export const connectDB = async ()=> {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDb Connected');  
   
}

module.exports = {connectDB}