import { Router } from "express";
import { isAuthenicated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as productSchema from './product.schema.js'
import * as productController from './product.controller.js'
const router = Router();
// create
router.post(
    "/",
    isAuthenicated,
    isAuthorized("seller"),
    fileUpload().fields([
        {name :"defaultImage" , maxCount : 1}, // array
        {name :"subImages" , maxCount : 3}
    ]),
    validation(productSchema.createProduct),
    productController.createProduct
)
// delete
router.delete(
    "/:id",
    isAuthenicated,
    isAuthorized("seller"),
    validation(productSchema.deleteProduct),
    productController.deleteProduct
)
// get products
router.get("/",productController.allProducts)
// get with filter
router.get("/filter",productController.allFilterProducts)

export default router;