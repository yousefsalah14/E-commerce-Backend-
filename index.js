import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './DB/connection.js';
import authRouter from './src/modules/auth/auth.routes.js'
import categoryRouter from './src/modules/category/category.routes.js'
import subcategoryRouter from './src/modules/subcategory/subcategory.routes.js'
import brandRouter from './src/modules/brand/brand.routes.js'
import couponRouter from './src/modules/coupon/coupon.routes.js'
import productRouter from './src/modules/product/product.routes.js'
import cartRouter from './src/modules/cart/cart.routes.js'
import orderRouter from './src/modules/order/order.routes.js'
const app = express();
dotenv.config();
const port = process.env.PORT 
// parsing
app.use( express.json() );
// connect to db
await connectDB()
// routers
app.use('/auth',authRouter)
app.use('/category',categoryRouter)
app.use('/subcategory',subcategoryRouter)
app.use('/brand',brandRouter)
app.use('/coupon',couponRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/order',orderRouter)
//page not found handler
app.all( '*', ( req, res, next ) =>
{
    return next(new Error('Page Not found',{cause :404}));
})
//global error handler
app.use( ( error, req, res, next ) =>
{
    const statusCode = error.cause || 500
    res.status(statusCode).json({sucess : false ,error:error.message , stack : error.stack})

})
app.listen(port,()=>{console.log(`Servern running on ${port}`); })