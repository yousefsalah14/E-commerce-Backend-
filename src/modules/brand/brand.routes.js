import { Router } from "express";
import * as brandController from './brand.controller.js'
import * as brandSchema from './brand.schema.js'
import { isAuthenicated } from "../../middleware/authentication.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
const router =Router()
// create
router.post("/",
    isAuthenicated,
    isAuthorized("admin"),
    fileUpload().single("brand"),
    validation(brandSchema.createBrand),
    brandController.createBrand
)
// update
router.patch("/:id",
    isAuthenicated,
    isAuthorized("admin"),
    fileUpload().single("brand"),
    validation(brandSchema.updateBrand),
    brandController.updateBrand
)
// delete
router.delete("/:id",
    isAuthenicated,
    isAuthorized("admin"),
    validation(brandSchema.deleteBrand),
    brandController.deleteBrand
)
// get brands
router.get('/',brandController.getBrands)



export default router