import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addToCart  = asyncHandler(async (req, res, next) => {
    const {productId ,quantity} =req.body
        // product 
        const product = await Product.findById(productId)
        if(!product) return next(new Error("Product not found", { cause:404 }));
        // check stock 
        if(!product.inStock(quantity))
            return next(new Error(`Sorrry There is Only ${product.avaliableItems} items`));
    // add product to cart 
    const cart = await Cart.findOneAndUpdate({user : req.user._id},
        {$push : {products :{productId , quantity}}},{new:true})
return res.json({ success: true, message: "product added successfully" ,cart});
});
export const userCart = asyncHandler(async (req, res, next) => {
    if(req.user.role=="user"){
        const cart  = await Cart.findOne({ user : req.user._id })
        return res.json({ success: true, cart });
    }
    if(req.user.role=="admin"&& !req.body.cartId)
    return next(new Error(" cart id is required ", { cause:400 }));
    const cart  = await Cart.findById(req.body.cartId)
    return res.json({ success: true, cart });
});
export const updateCart = asyncHandler(async (req, res, next) => {
    const {productId , quantity} = req.body
    // product 
    const product = await Product.findById(productId)
    if(!product) return next(new Error("Product not found", { cause:404 }));
    // check stock 
    if(!product.inStock(quantity))
        return next(new Error(`Sorrry There is Only ${product.avaliableItems} items`));
    const cart  = await Cart.findOneAndUpdate({
        // find
        user : req.user._id ,
        "products.productId":productId
    },{
        // update
        // $ -> refere to this
        "products.$.quantity":quantity
    },{
        // new version 
        new :true
    })
    if(!cart) return next(new Error("Cart Not Found", { cause:404}));
    return res.json({ success: true, message: "Cart Updated Successfully✅ ",cart });
});
export const removeFromCart  = asyncHandler(async (req, res, next) => {
    const {productId}= req.params
    // product 
    const product = await Product.findById(productId)
    if(!product) return next(new Error("Product not found", { cause:404 }));
    // remove from cart
    const cart = await Cart.findOneAndUpdate(
        {user: req.user._id},
        {$pull : {products  : {productId}}},
        {new : true}
    )
    return res.json({ success: true, message: "Product Deleted Successfully✅ ",cart });
});
export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        {user: req.user._id},
        {products  :[]},
        {new : true}
    )
    return res.json({ success: true, cart });
});