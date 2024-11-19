import { Router } from "express";
import { isAuthenicated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as orderSchema from './order.schema.js'
import * as orderController from './order.controller.js'
const router = Router();
// create order 
router.post(
    '/',
    isAuthenicated,
    isAuthorized("user"),
    validation(orderSchema.createOrder),
    orderController.createOrder
)
// cancel order 

export default router;