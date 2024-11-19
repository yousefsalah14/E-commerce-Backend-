import {nanoid} from "nanoid";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Product } from "../../../DB/models/product.model.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  // category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));
  // subcategory
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("subcategory not found", { cause: 404 }));
  // brand
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("brand not found", { cause: 404 }));
  //check files
  if (!req.files)
    return next(new Error(" product images are required!! ", { cause: 400 }));
  //check folder name
  const cloudFolder = nanoid();
  // upload sub images
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }
  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
  );
  // create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage : {id : public_id , url : secure_url},
    images,
  })
  return res.json({ success: true, message: "product created successfully " });
});
export const deleteProduct = asyncHandler(async (req, res, next) => {
    // check product 
    const product = await Product.findById(req.params.id)
    if(!product) return next(new Error("Product not found ", { cause:404 }));
    // check owner 
    if(req.user._id.toString()!==product.createdBy.toString()) 
        return next(new Error(" Not Allowed to delete this product  ", { cause:401}));
    // delete product 
    await product.deleteOne()
    // delete images
    const ids = product.images.map((image)=>image.id)
    ids.push(product.defaultImage.id)
    await cloudinary.api.delete_resources(ids)
    // delete folder
    await cloudinary.api.delete_folder(
        `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
    )
    return res.json({ success: true, message: "product deleted Succssfully " });
});
export const allProducts  = asyncHandler(async (req, res, next) => {
  let {keyword , sort , page} = req.query
  // search
  if(keyword){
    const products = await Product.find({name: {$regex : keyword,$options:"i"} })
    return res.json({ success: true, products });
  } 
  // sort 
  if(sort){
    const products = await Product.find().sort(sort)
    return res.json({ success: true, products });
  }
  // pagination 
  page = page < 1 || isNaN(page) || !page  ? page = 1 : page
  const limit = 1
  const skip = limit * (page-1)

    const products = await Product.find({...req.query}).skip(skip).limit(limit)
    return res.json({ success: true, products });

});
export const allFilterProducts  = asyncHandler(async (req, res, next) => {
  if(req.query){
    const products = await Product.find({...req.query})
    return res.json({ success: true, products });
  } 
  // if not filterd applied return all
  const products = await Product.find()
  return res.json({ success: true, products });
});