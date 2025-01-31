import UserModel, { roleType } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/token.js";
import * as dataBaseService from "../DB/dbService.js";
import asyncHandler from "../utils/asyncHandler.js";


export const tokenTypes={
    access:"access",
    refresh:"refresh"
}
export const decodeToken=async({authorization="",tokenType=tokenTypes.access,next={}})=>{


const [Bearer,token]=authorization.split(" ")||[];
if(!Bearer||!token)return next(new Error("In-valid token",{cause:401}));

let ACCESS_SEGNITURE=undefined;
let REFRESH_SEGNITURE=undefined;
switch(Bearer){
    case roleType.User:
        ACCESS_SEGNITURE=process.env.USER_ACCESS_TOKEN;
        REFRESH_SEGNITURE=process.env.USER_REFRESH_TOKEN;
        break;
    case roleType.Admin:
        ACCESS_SEGNITURE=process.env.ADMIN_ACCESS_TOKEN;
        REFRESH_SEGNITURE=process.env.ADMIN_REFRESH_TOKEN;
        break;
    default:
        return next(new Error("In-valid segniture",{cause:401}));
}


const decoded=verifyToken(token,tokenType==tokenTypes.access?ACCESS_SEGNITURE:REFRESH_SEGNITURE);
if(!decoded)return next(new Error("In-valid token",{cause:401}));
const user=await dataBaseService.findById({model:UserModel,id:decoded.id});
if(!user)return next(new Error("user not found",{cause:401}));
if(user.changeCredentials?.getTime()>decoded.iat * 1000)return next(new Error("In-valid token",{cause:401}));

return user;
}
export const authentication=async(req,res,next)=>{
        const{authorization}=req.headers;
         const user=await decodeToken({authorization,next});
         req.user=user;
       
        return next();
    
}
export const allowTo=(role=[])=>{
    return asyncHandler(async(req,res,next)=>{
     if(!role.includes(req.user.role))return next(new Error("Unauthorized",{cause:401}));
     next();
    })
}