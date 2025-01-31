import { Router  } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import * as authServices from './auth.service.js'

import {registerSchema,loginSchema, verifyAccountSchema} from "./validation.js"
import {validation} from '../../middlewares/validation.js'

const router=Router();
router.post('/login',validation(loginSchema),asyncHandler(authServices.login));
router.post('/verifyAccount',validation(verifyAccountSchema),asyncHandler(authServices.verifyAccount))
router.post('/register',validation(registerSchema),asyncHandler(authServices.register),);
router.get('/refreshToken',asyncHandler(authServices.refreshToken));
router.post('/loginWithGmail',asyncHandler(authServices.loginWithGoogle));
export default router;