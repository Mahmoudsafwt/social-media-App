import Joi from "joi";
import { generalfield } from "../../middlewares/validation.js";


export const registerSchema=Joi.object({
    userName:generalfield.userName.required(),
    email:generalfield.email.required(),
    password:generalfield.password.required(),
    confirmPassword:generalfield.confirmPassword.required()
})
.required()
export const loginSchema=Joi.object({
    email:generalfield.email.required(),
    password:generalfield.password.required()
}).required();

export const verifyAccountSchema=Joi.object({email:generalfield.email.required(),otp:Joi.string().required()}).required();