import { Router } from "express";
import { isAuthenicated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as subcategoryController from './subcategory.controller.js'
import * as subcategorySchema from './subcategory.schema.js'
const router = Router({mergeParams:true})
// create
router.post('/',
    isAuthenicated,
    isAuthorized("admin"),
    fileUpload().single("subcategory"),
    validation(subcategorySchema.createSubcategory),
    subcategoryController.createSubategory
)
 // update
 router.patch('/:id',
    isAuthenicated,
    isAuthorized("admin"),
    fileUpload().single("subcategory"),
    validation(subcategorySchema.updateSubcategory),
    subcategoryController.updateSubcategory
)
// delete 
router.delete('/:id',
    isAuthenicated,
    isAuthorized("admin"),
    validation(subcategorySchema.deleteSubcategory),
    subcategoryController.deleteSubcategory
)
// get 
router.get('/',validation(subcategorySchema.getSubcategoris),subcategoryController.allSubcategories)

export default router