import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        mongoose.connect(process.env.DBURI);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("failed to connect DB");
    }
}
export default connectDB;