import joi from 'joi'
import { objectIdValidation } from '../../middleware/validation.middleware.js'

export const createSubcategory = joi.object({
    name:joi.string().min(5).max(20).required(),
    category: joi.string().custom(objectIdValidation).required()
}).required()
export const updateSubcategory = joi.object({
    name:joi.string().min(5).max(20),
    id: joi.string().custom(objectIdValidation).required(),
    category : joi.string().custom(objectIdValidation).required()
}).required()
export const deleteSubcategory = joi.object({
    id: joi.string().custom(objectIdValidation).required(),
    category : joi.string().custom(objectIdValidation).required()
}).required()
export const getSubcategoris = joi.object({
    category: joi.string().custom(objectIdValidation)
}).required()