import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createBrand = asyncHandler(async (req, res, next) => {
    const {categories , name} = req.body
    categories.forEach(async (categoryId) => {
        const category = await Category.findById(categoryId)
        if(!category)return next(new Error(`Category Has ${categoryId} not Found`, { cause: 404 }));
    }); 
    // file
    if(!req.file) return next(new Error("Brand Image is Required",{cause:400}));
    // upload 
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
        {folder :`${process.env.CLOUD_FOLDER_NAME}/brands`}
    )
    // save in db
    const brand = await Brand.create({
        name,
        createdBy:req.user._id,
        slug:slugify(name),
        image : {id : public_id , url : secure_url},
    })
    // save brands in categories
    categories.forEach(async (categoryId) => {
            await Category.findByIdAndUpdate(categoryId ,{$push : {brands :brand._id}})

    }); 
    return res.json({ success: true, message: "brand created Successfully " });
});
export const updateBrand = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id)
    if(!brand) return next(new Error(" Brand Not Found ", { cause: 404 }));
    if(req.file){
        const {public_id , secure_url} = await cloudinary.uploader.upload(brand.image.id)
        brand.image = {url:secure_url , id : public_id}
    }
    brand.name = req.body.name ? req.body.name : brand.name
    brand.slug = req.body.name ? slugify(req.body.name) : brand.slug
    await brand.save()
    return res.json({ success: true, message: "brand updated successfully" });
});

export const deleteBrand =asyncHandler(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    if (!brand) return next(new Error(" brand not found", { cause: 404 }));
    // delete image
    await cloudinary.uploader.destroy(brand.image.id)
    // delete brand from categories 
    await Category.updateMany({},{$pull : {brands : brand._id}})
    return res.json({ success: true, message: "Brand Delete Successfully" });

});
export const getBrands  = asyncHandler(async (req, res, next) => {
    const Brands = await Brand.find()
    return res.json({ success: true, Brands });
});