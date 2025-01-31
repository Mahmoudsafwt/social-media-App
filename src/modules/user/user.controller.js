import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import * as userServices from './user.service.js'
import { authentication } from "../../middlewares/authentication.js";
import { validation } from "../../middlewares/validation.js";
import * as userSchema from "./validation.js";
const router=Router();

router.get('/getProfile',asyncHandler(authentication),asyncHandler(userServices.getSingleUser));

router.post('/changePassword',validation(userSchema.changePasswordSchema),
asyncHandler(authentication),
asyncHandler(userServices.changePassword));

router.post('/forgetPasswordSendEmail',
validation(userSchema.forgetPasswordSendEmailSchema),
asyncHandler(userServices.forgetPasswordSendEmail));

router.post('/forgetPassword',
validation(userSchema.forgetPasswordSchema),asyncHandler(userServices.forgetPassword));

router.get('/shareProfile/:id',asyncHandler(authentication),
validation(userSchema.shareProfileSchema),
asyncHandler(userServices.shareProfile));

router.post('/updateEmail',asyncHandler(authentication),
validation(userSchema.updateEmailSchema),
asyncHandler(userServices.updateEmail));

router.post('/verifyNewEmail',asyncHandler(authentication),
validation(userSchema.verifyNewEmailSchema),
asyncHandler(userServices.verifyNewEmail))

router.patch('/updateProfile',asyncHandler(authentication),
validation(userSchema.updateProfileSchema),asyncHandler(userServices.updateProfile))

        
export default router;