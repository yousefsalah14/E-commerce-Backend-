import { model, Schema, Types } from 'mongoose';

const orderSchema = new Schema({
    user : {
        type : Types.ObjectId , 
        ref: "User",
        required : true
    },
    products :[{
        productId:{
            type : Types.ObjectId,
            ref:"Product",
            name : String,
            itemPrice : Number,
            totalPrice : Number
        },
        quantity : {type : Number ,min : 1 }
    }],
    address :{type  :String , required :true}  ,
    payment : {type :String , default : "cash",enum : ["cash","visa"] },
    phone :{type  :String , required :true} ,
    price :{type  :Number , required :true} ,
    invoice :{url : String , id:String } ,
    coupon :{
        id :{type : Types.ObjectId , ref : "Coupon"},
        name : String ,
        discount : {
            type : Number,
            min : 1 , max : 100
        }
    } ,
    status : {
        type : String , 
        default :"placed",
        enum :["placed","shipped","delivered","canceled","refunded"]
    } ,
},{ timestamps: true });

export const Order = model('Order', orderSchema);
