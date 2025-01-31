
import Joi from "joi";
import { generalfield } from "../../middlewares/validation.js";

export const changePasswordSchema=Joi.object({
    oldPassword:generalfield.password.required(),
    password:generalfield.password.required(),
    confirmPassword:generalfield.confirmPassword.required()

}).required()
export const forgetPasswordSendEmailSchema=Joi.object({email:generalfield.email.required()}).required();
export const forgetPasswordSchema=Joi.object({email:generalfield.email.required(),
    OTP:generalfield.OTP.required(),password:generalfield.password.required(),
    confirmPassword:generalfield.confirmPassword.required()}).required();

export const shareProfileSchema=Joi.object({id:generalfield.id.required()}).required();
export const updateEmailSchema=Joi.object({
newEmail:generalfield.email.required()}).required();
export const verifyNewEmailSchema=Joi.object({OTP:generalfield.OTP.required(),newEmail:generalfield.email.required()})
export const updateProfileSchema=Joi.object({userName:generalfield.userName.required(),phone:generalfield.phone.required()}).required();

