import UserModel from "../../DB/models/user.model.js";
import { resetPasswordEvent, sendEmailTypes, updateEmailEvent } from "../../utils/email/eventEmail.js";
import { sendEmailTemplate } from "../../utils/email/generateHTML.js";
import generateOTP from "../../utils/generateOTP.js";
import { compareHash, hash } from "../../utils/hashing/hashing.js";
import * as dataBaseService from "../../DB/dbService.js"
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";


export const getSingleUser=async(req,res,next)=>{
    
   
    
    const user= await dataBaseService.findById({model:UserModel,id:req.user._id,select:"userName email veiwers phone -_id gender",
        populate:[{path:"veiwers.user_id",select:"userName email gender image -_id"}]});
    if(!user)return next(new Error("User not found",{cause:404}));
    
    
    const decryptedPhone=decrypt({encryptedData:user.phone,key:process.env.ENCRYPTION_KEY})

    user.phone=decryptedPhone;
     
    return res.status(200).json({message:"Done",user:user});
}
export const changePassword=async(req,res,next)=>{
    const user=req.user;
    const{oldPassword,password}=req.body;
    
    if(!compareHash(oldPassword,user.password))return next(new Error("wrong password",{cause:409}));
    if(compareHash(password,user.password))return res.status(200).json({message:"Done"});
    const hashedPassword=hash(password);
    //await UserModel.updateOne({_id:user._id},{$set:{password:hashedPassword}});
    await dataBaseService.updateOne({model:UserModel,filter:{_id:user._id},data:{$set:{password:hashedPassword}}});

    return res.status(200).json({message:"Done"});
}
export const forgetPasswordSendEmail=async(req,res,next)=>{
    const{email}=req.body;
    //const user=await UserModel.findOne({email});
    const user=await dataBaseService.findOne({model:UserModel,filter:{email}});
    if(!user)return next(new Error("User not found",{cause:404}));
    const otp=generateOTP();
    const hashedOTP=hash(otp);
   // await UserModel.updateOne({email},{$set:{OTPs:{createdAt:new Date(),resetPasswordOTP:hashedOTP}}});
    await dataBaseService.updateOne({model:UserModel,filter:{email},data:{$set:{OTPs:{createdAt:new Date(),resetPasswordOTP:hashedOTP}}}});

    

        resetPasswordEvent.emit(sendEmailTypes.resetPassword,
                email,
                sendEmailTypes.resetPassword,
                sendEmailTemplate(otp,user.userName,"reset password"));

    return res.status(200).json({message:"Done"});

    
}
export const forgetPassword=async(req,res,next)=>{
    const{email,OTP,password}=req.body;
    //const user=await UserModel.findOne({email});
    const user=await dataBaseService.findOne({model:UserModel,filter:{email}});
    if(!user)return next(new Error("User not found",{cause:404}));
    const compareOTO=compareHash(OTP,user.OTPs[0].resetPasswordOTP);
    if(!compareOTO)return next(new Error("wrong otp",{cause:404}));
    const hashedPassword=hash(password);
    //await UserModel.updateOne({email},{$set:{password:hashedPassword,OTPs:null}});
    await dataBaseService.updateOne({model:UserModel,filter:{email},data:{$set:{password:hashedPassword,OTPs:null}}});
    return res.status(200).json({message:"Done"});
 

}

export const shareProfile=async(req,res,next)=>{

    const {id}=req.params;
    let user=undefined;
    if(id===req.user._id.toString()){
       user=req.user;
    }else{
        user=await dataBaseService.findOneAndUpdate({model:UserModel,filter:{_id:id,isDeleted:false,
           'veiwers.user_id':req.user._id},data:{$inc:{'veiwers.$.count':1}},select:"userName email image gender -_id "});
           
            
            if(user)return res.status(200).json({message:"Done",user});
      user=await dataBaseService.findOneAndUpdate({
        model:UserModel,
        filter:{_id:id,isDeleted:false},
        data:{$push:{veiwers:{user_id:req.user._id,time:Date.now()}}}
          , select:"userName email image gender -_id "})
    }



    return res.status(200).json({message:"Done",user});
}
export const updateEmail=async(req,res,next)=>{
const {newEmail}=req.body;
let user=await dataBaseService.findOne({model:UserModel,filter:{email:newEmail}});
if(user)return next(new Error("Email already exists",{cause:409}));
const OTP=generateOTP();
const hashedOTP=hash(OTP);
const templet=sendEmailTemplate(OTP,req.user.userName,sendEmailTypes.updateEmail)
user=await dataBaseService.findByIdAndUpdate({model:UserModel,id:req.user._id,data:{$set:{OTPs:{createdAt:new Date(),updateEmailOTP:hashedOTP}}}});

updateEmailEvent.emit(sendEmailTypes.updateEmail,newEmail,sendEmailTypes.updateEmail,templet);
return res.status(200).json({success:true,message:"Done"});

}
export const verifyNewEmail=async(req,res,next)=>{
    const{OTP,newEmail}=req.body;
    const user=await dataBaseService.findById({model:UserModel,id:req.user._id});
    const checkNewEmail=await dataBaseService.findOne({model:UserModel,filter:{email:newEmail}});
    if(checkNewEmail)return next(new Error("Email already exists",{cause:409}));
    if(!user)return next(new Error("User not found",{cause:404}));
    const compareOTP=compareHash(OTP,user.OTPs[0].updateEmailOTP);
    if(!compareOTP)return next(new Error("wrong otp",{cause:404}));
    user.email=newEmail;
    user.OTPs=[];
    await user.save();
    return res.status(200).json({message:"Done"});
}
export const updateProfile=async(req,res,next)=>{
    const{userName,phone}=req.body;
    const encryptedPhone=encrypt({data:phone,key:process.env.ENCRYPTION_KEY});
    const user=await dataBaseService.findByIdAndUpdate({model:UserModel,id:req.user._id,data:{$set:{userName,phone:encryptedPhone}}});
     if(!user)return next(new Error("User not found",{cause:404}));
     return res.status(200).json({message:"Done"});
}