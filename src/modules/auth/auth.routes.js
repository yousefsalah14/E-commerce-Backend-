import { validation } from "../../middleware/validation.middleware.js";
import * as authSehema from './auth.schema.js'
import * as authController from './auth.controller.js'

import { Router } from "express";

const router = Router()
// signup
router.post( '/signup', validation( authSehema.signUp ), authController.signUp ) 
// activate account
router.get('/activate/:token',validation(authSehema.activateAcc),authController.activateAcc)
// signin
router.post( "/signin", validation( authSehema.signIn ), authController.signIn )
//forget code 
router.patch( '/forgetCode', validation( authSehema.forgertCode ), authController.forgertCode )
// reset password
router.patch('/resetPassword',validation(authSehema.resetPassword),authController.resetPassword)

export default router