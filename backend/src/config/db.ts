import mongoose from "mongoose";
import { MongoDB } from "../utils/constants/messages";
import { MONGO_URI } from "../utils/env";


const connectDB=async()=>{
    try {
       
        let connect=await mongoose.connect(MONGO_URI)
        console.log(`${MongoDB.SUCCESS} in ${connect.connection.host}`)
    } catch (error) {
        console.error(MongoDB.ERROR)
        process.exit(1);
    }
}

export default connectDB