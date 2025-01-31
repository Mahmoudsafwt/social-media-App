import Joi from "joi";
import { registerSchema } from "../modules/auth/validation.js";
import { Types } from "mongoose";

export const validation=(schema)=>{
return (req,res,next)=>{
    const data={...req.body,...req.params,...req.query}
    const {error}=schema.validate(data,{abortEarly:false});
    if(error){
        const errors=error.details.map((err)=>err.message);
        return res.status(400).json({errors});
    }
   
    next();

}
}
export const isValidObjectId=(value,helper)=>{
    
        return Types.ObjectId.isValid(value)?true:helper.message('invalid id');
}
export const generalfield={
    userName:Joi.string().min(3).max(20),
    email:Joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword:Joi.string().valid(Joi.ref('password')),
    OTP:Joi.string().length(5),
    id:Joi.string().custom(isValidObjectId),
    phone:Joi.string().length(11),
        
    
}
    

