import joi from 'joi'
import { objectIdValidation } from '../../middleware/validation.middleware.js'

export const createBrand = joi.object({
    name : joi.string().min(2).max(12).required(),
    categories:joi.array()
    .items(joi.string()
    .custom(objectIdValidation)
    .required())
    .required(),

}).required()

export const updateBrand = joi.object({
    id : joi.string().custom(objectIdValidation).required() ,
    name : joi.string().min(2).max(12)

}).required()
export const deleteBrand = joi.object({
    id : joi.string().custom(objectIdValidation).required() 
}).required()