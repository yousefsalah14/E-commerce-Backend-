import { Router } from "express";
import { isAuthenicated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as cartSchema from './cart.schema.js'
import * as cartController from './cart.controller.js'
const router = Router();
// add to cart
router.post('/',
    isAuthenicated,
    isAuthorized("user"),
    validation(cartSchema.addToCart),
    cartController.addToCart
)
// get user cart
router.get('/',
    isAuthenicated,
    isAuthorized("user","admin"),
    validation(cartSchema.userCart),
    cartController.userCart
)
// update cart
router.patch('/',
    isAuthenicated,
    isAuthorized("user"),
    validation(cartSchema.updateCart),
    cartController.updateCart 
)
// remove product from cart
router.patch(
    '/:productId',
    isAuthenicated,
    isAuthorized("user"),
    validation(cartSchema.removeFromCart),
    cartController.removeFromCart 

)
// clear cart
router.put(
    '/clear',
    isAuthenicated,
    isAuthorized("user"),
    cartController.clearCart 
)
export default router;