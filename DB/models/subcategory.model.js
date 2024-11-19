import { model, Schema, Types } from "mongoose";

const subcategorySchema = new Schema({
    name:{
        type:String,
        required :true ,
        unique:true,
        min:5 , max: 20
    },
    slug:{
        type:String,
        required :true ,
        unique:true,
    },
    image : {
        id :{type:String},
        url:{type:String}
    },
    createdBy : {
        type : Types.ObjectId ,
        ref: "User",
        required : true
    },
    category:{
        type : Types.ObjectId ,
        ref: "Category",
        required : true
    },
    brands :[{
        type:String,
        ref :"Brand"
    }]
},{timestamps:true})


export const  Subcategory = model("Subcategory",subcategorySchema)