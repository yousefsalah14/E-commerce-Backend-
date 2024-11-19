import { model, Schema, Types } from "mongoose";
import { Subcategory } from "./subcategory.model.js";

const categorySchema = new Schema({
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
    brands :[{
        type:String,
        ref :"Brand"
    }]
},{timestamps:true, toJSON:{virtuals : true},toObject:{virtuals : true}})

categorySchema.post('deleteOne',{document:true , query :false},async function(){
    await Subcategory.deleteMany({
        category: this._id
    })
})
categorySchema.virtual("subcategory",{
    ref : "Subcategory",
    localField : "_id", // primary kay
    foreignField : "category" // foreign key
})
// how to use it
// make toJson in schema --> {virtuals : true} to display in response as json object
// toObject:{virtuals : true} to display in code and cmd and console

export const  Category = model("Category",categorySchema)