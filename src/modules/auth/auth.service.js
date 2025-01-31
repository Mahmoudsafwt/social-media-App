import UserModel, { roleType } from "../../DB/models/user.model.js";
import { compareHash, hash } from "../../utils/hashing/hashing.js";
import generateOTP from "../../utils/generateOTP.js";
import {sendEmailTemplate} from "../../utils/email/generateHTML.js";
import { verifyAccountEvent, sendEmailTypes } from "../../utils/email/eventEmail.js";
import { generateToken,  verifyToken } from "../../utils/token/token.js";
import {OAuth2Client} from'google-auth-library';
import * as dataBaaseService from "../../DB/dbService.js"
import { decodeToken, tokenTypes } from "../../middlewares/authentication.js";

export const register=async(req,res,next)=>{
    const{userName,email,password}=req.body;
    
    const user =await dataBaaseService.findOne({model:UserModel,filter:{email}});
    // const user=await UserModel.findOne({email});
    if(user)return next(new Error("User already exists",{cause:409}));
    const hashedPassword= hash(password);
    const otp=generateOTP();
    const hashedOTP=hash(otp);
    const otpObject={
        "createdAt":new Date(),
        "verificationOTP":hashedOTP
    }
    
    await dataBaaseService.create({model:UserModel,data:{userName,email,password:hashedPassword,OTPs:otpObject}})

   
    verifyAccountEvent.emit(sendEmailTypes.verifyAccount,
        email,
        sendEmailTypes.verifyAccount,
        sendEmailTemplate(otp,userName,"email verification"));

    return res.status(200).json({message:"Done"});
    
    
    
}
export const verifyAccount=async(req,res,next)=>{
    const{email,otp}=req.body;
    
    const user =await dataBaaseService.findOne({model:UserModel,filter:{email}});
    if(!user)return next(new Error("wrong email",{cause:404}));
    if(!user.OTPs[0].verificationOTP)return next(new Error("your email is already verified",{cause:404}));
    const flag=compareHash(otp,user.OTPs[0].verificationOTP)
    if(flag){
        
        await dataBaaseService.updateOne({ model:UserModel,filter:{email},data:{$set:{confirmEmail:true,OTPs:null}}})
       
        return res.status(200).json({message:"Done"});
    }
    return next(new Error("wrong otp",{cause:404}));

}
export const login =async(req,res,next)=>{
    const{email,password}=req.body;
    const user=await dataBaaseService.findOne({model:UserModel,filter:{email}});
    if(!user)return next(new Error("wrong email or password",{cause:404}));
    if(!user.confirmEmail)return next(new Error("confirm your email first",{cause:404}));
    if(!compareHash(password,user.password)) return next(new Error("wrong email or password",{cause:404}));
    
    const accessToken=generateToken({payload:{id:user._id},
    segneture:user.role==roleType.User?process.env.USER_ACCESS_TOKEN:process.env.ADMIN_ACCESS_TOKEN,options:{expiresIn:process.env.ACCESS_TOKEN_EXPIRES}},);
    const refreshToken=generateToken({payload:{id:user._id},
    segneture:user.role==roleType.User?process.env.USER_REFRESH_TOKEN:process.env.ADMIN_REFRESH_TOKEN,options:{expiresIn:process.env.REFRESH_TOKEN_EXPIRES}},);
    const verifyTokens=verifyToken(refreshToken,user.role==roleType.User?process.env.USER_REFRESH_TOKEN:process.env.ADMIN_REFRESH_TOKEN);
    user.changeCredentials=new Date(verifyTokens.iat*1000);
    await user.save();
     
    return res.status(200).json({success:true,tokens:{accessToken,refreshToken}});
}

export const refreshToken=async(req,res,next)=>{
    const { authorization } = req.headers;
    const user =await decodeToken({authorization,tokenType:tokenTypes.refresh,next});
        const accessToken=generateToken({payload:{id:user._id},
        segneture:user.role==roleType.User?process.env.USER_ACCESS_TOKEN:process.env.ADMIN_ACCESS_TOKEN,
        options:{expiresIn:process.env.ACCESS_TOKEN_EXPIRES}},);
        const refreshToken=generateToken({payload:{id:user._id},
            segneture:user.role==roleType.User?process.env.USER_REFRESH_TOKEN:process.env.ADMIN_REFRESH_TOKEN,
            options:{expiresIn:process.env.REFRESH_TOKEN_EXPIRES}},);
            
            const verifyTokens=verifyToken(refreshToken,user.role==roleType.User?process.env.USER_REFRESH_TOKEN:process.env.ADMIN_REFRESH_TOKEN);
        user.changeCredentials=new Date(verifyTokens.iat*1000);
    await user.save();

            return res.status(200).json({success:true,tokens:{accessToken,refreshToken}});
}

export const loginWithGoogle=async(req,res,next)=>{
    const{idToken}=req.body;
    
const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENTID,  
  });
  const payload = ticket.getPayload();
  
  return payload;
}
let user=await verify()
if(!user)return next(new Error("In-valid token",{cause:400}));
const {name,email,picture,email_verified}=user;
const checkuser =await dataBaaseService.findOne({model:UserModel,filter:{email}});
if(checkuser)return next(new Error("User already exists",{cause:409}));
user=await dataBaaseService.create({model:UserModel,data:{userName:name,email,image:picture,confirmEmail:email_verified}})


const accessToken=generateToken({payload:{id:user._id},
    segneture:user.role=="user"?process.env.USER_ACCESS_TOKEN:process.env.ADMIN_ACCESS_TOKEN,
    options:{expiresIn:process.env.ACCESS_TOKEN_EXPIRES}},);
    const refreshToken=generateToken({payload:{id:user._id},
        segneture:user.role=="user"?process.env.USER_REFRESH_TOKEN:process.env.ADMIN_REFRESH_TOKEN,
        options:{expiresIn:process.env.REFRESH_TOKEN_EXPIRES}},);
return res.status(200).json({message:"Done",tokens:{accessToken,refreshToken}});

}