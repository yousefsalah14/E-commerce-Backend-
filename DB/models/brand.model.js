import { model, Schema, Types } from "mongoose" 

const brandSchema = Schema({
    name :{
        type : String,
        unqiue:true,
        required :true
    },
    slug :{
        type : String,
        unqiue:true,
        required :true
    },
    image:{
        url:{type:String , required :true},
        id :{type:String , required :true}
    },
    createdBy:{
        type : Types.ObjectId,
        ref:"User"
    }
},{timestamps :true})

export const Brand = model("Brand",brandSchema)