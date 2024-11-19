import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createSubategory = asyncHandler(async (req, res, next) => {
    // check category 
    const category = await Category.findById(req.params.category)
    if(!category) return next(new Error(" category not Found 😒", { cause:404 }));
    //check file
    if(!req.file) return next(new Error("subcategory image is required 😠", { cause:400}));
    const {public_id,secure_url}= await cloudinary.uploader.upload(
        req.file.path,{
            folder : `${process.env.CLOUD_FOLDER_NAME}/subcategory`
        }
    )
    // save category in db
    await Subcategory.create({
        name:req.body.name,
        createdBy: req.user._id,
        slug:slugify(req.body.name),
        image:{id:public_id,url:secure_url},
        category:req.params.category
    })
    return res.json({ success: true, message: "Subcategory Created Successfully✅" });
});

export const updateSubcategory = asyncHandler(async (req, res, next) => {
    console.log("commming")
    // check category in db
    const category = await Category.findById(req.params.category)
    if(!category) return next(new Error("category not found", { cause: 404 }));
    // check subcategory and parent 
    const subcategory = await Subcategory.findOne({ _id:req.params.id, category:req.params.category})
    if(!subcategory) return next(new Error("subcategory not found", { cause: 404 }));

    // check owner
    if(req.user._id.toString() !== subcategory.createdBy.toString()) return next(new Error("you not the owner 😠"));
    
    // check file
    if(req.file){
        const {public_id ,secure_url} = await cloudinary.uploader.upload(
            req.file.path,
            {public_id:subcategory.image.id}
        )
        subcategory.image = {id :public_id , url : secure_url }
    }
        subcategory.name = req.body.name ? req.body.name : subcategory.name
        subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    // Save the updated subcategory
    
    await subcategory.save();
    console.log("alooooooo");
    
    // Send response
    return res.json({ success: true, message: "Subcategory updated successfully ✅" });

});

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
    // check category in db and delete it
    const category = await Category.findById(req.params.category)
    if(!category)return next(new Error("category not found", { cause: 404 }));
    // check subcategory and parent 
    const subcategory = await Subcategory.findOneAndDelete({ _id:req.params.id, category:req.params.category})
    if(!subcategory) return next(new Error("subcategory not found", { cause: 404 }));
    // delete it from cloudinary
    await cloudinary.uploader.destroy(subcategory.image.id)
    // send res
    return res.json({ success: true, message: "subcategory deleted successfully ✅" });
});
export const allSubcategories = asyncHandler(async (req, res, next) => {
    if(req.params.category){
        // all subcategories depend on spacific category
        const results = await Subcategory.find({category : req.params.category }).populate([
            {
                path:"category",
                populate :[{path:"createdBy"}]
            }
        ])
        return res.json({ success: true, Subcategories: results});
    }
    const all = await Subcategory.find().populate([
        {
            path:"category",
            populate :[{path:"createdBy"}]
        }
    ])

    return res.json({ success: true, Subcategories: all});
});
