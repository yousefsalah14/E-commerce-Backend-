import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from 'voucher-code-generator'

 export const  createCoupon = asyncHandler(async (req, res, next) => {
    // generate code
    const code = voucher_codes.generate({length:5})
    // save in db
    const coupon = await Coupon.create({
        name : code[0],
        discount : req.body.discount,
        createdBy: req.user._id,
        expiredAt : new Date(req.body.expiredAt).getTime()
    })
    return res.status(201).json({ success: true, results:{coupon} });
 });
 export const updateCoupon  = asyncHandler(async (req, res, next) => {
    // check coupon and date  
    const coupon = await Coupon.findOne({name:req.params.code , expiredAt :{$gt:Date.now()}})
    if(!coupon) return next(new Error(" coupon not found ", { cause:404 }));
    // check owner 
    if(req.user.id!== coupon.createdBy.toString())
        return next(new Error(" Not Allowed To Update This coupon ",{cause:401}));
    // update 
     coupon.discount = req.body.discount ? req.body.discount : coupon.discount 
     coupon.expiredAt = req.body.expiredAt ?  new Date(req.body.expiredAt).getTime() : coupon.expiredAt 
     // save
     await coupon.save()
     return res.json({ success: true, message: " coupon updated successfully" });
 });
 export const deleteCoupon = asyncHandler(async (req, res, next) => {
     // check coupon and date  
     const coupon = await Coupon.findOneAndDelete({name:req.params.code , createdBy : req.user._id})
     if(!coupon) return next(new Error(" coupon not found or not Authorized to delete this coupon  ", { cause:404 }));
     return res.json({ success: true, message: "coupon deleted successfully " });

 })
 export const getAllCoupons  = asyncHandler(async (req, res, next) => {
    // if admin --> all coupons
    if(req.user.role==="admin"){
        const coupons = await Coupon.find()
        return res.json({ success: true, coupons });
    }
    //if seller --> his coupon 
    if(req.user.role==="seller"){
        const coupons = await Coupon.find({createdBy : req.user._id})
        return res.json({ success: true, coupons });
    }
 });