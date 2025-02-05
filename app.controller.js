
import connectDB from "./src/DB/connection.js";
import authRouter from "./src/modules/auth/auth.controller.js"
import userRouter from "./src/modules/user/user.controller.js"
import cors from 'cors';
const bootstrap=async(app,express)=>{
   await connectDB();
   app.use(cors())
   app.use('/uploadsImages',express.static('uploadsImages'));
app.use(express.json());
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.all("*",(req,res)=>{
    res.status(404).json({message:"Route not found"});
})
app.use((err,req,res,next)=>{
    const cause=err.cause||500;
    res.status(cause).json({message:err.message,stack:err.stack});
})
}
export default bootstrap;