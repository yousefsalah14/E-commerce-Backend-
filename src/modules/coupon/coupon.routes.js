import { Router } from "express";
import { isAuthenicated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import  * as couponSchema from './coupon.schema.js'
import  * as couponController from './coupon.controller.js'
const router = Router();
// create
router.post('/',
    isAuthenicated,
    isAuthorized('seller'),
    validation(couponSchema.createCoupon),
    couponController.createCoupon
)
// update
router.patch(
    "/:code",
    isAuthenicated,
    isAuthorized("seller"),
    validation(couponSchema.updateCoupon),
    couponController.updateCoupon
)
// delete 
router.delete(
    "/:code",
    isAuthenicated,
    isAuthorized("seller"),
    validation(couponSchema.deleteCoupon),
    couponController.deleteCoupon
)
// get all coupons 
router.get(
    "/",
    isAuthenicated,
    isAuthorized("seller","admin"),
    couponController.getAllCoupons
)
export default router;