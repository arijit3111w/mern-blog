import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import {encode} from 'entities'
import Category from "../models/category.model.js";


export const addBlog = async (req, res,next) => {
    try{
        const data = JSON.parse(req.body.data);
        let featuredImage = ''; // Initialize featuredImage variable
        if (req.file) {
              // Upload an image
              const uploadResult = await cloudinary.uploader
                .upload(
                  req.file.path, // Path to the image file
                  {folder:'mern-blog',resource_type: 'auto'} // Specify the folder and resource type
                )
                .catch((error) => {
                    next(handleError(500, "Image upload failed: " + error.message)); // Handle image upload errors
                });
        
                featuredImage = uploadResult.secure_url; // Update the user's avatar with the uploaded image URL
            }
        const blog = new Blog({
            author: data.author, // Assuming author is passed in the data
            category: data.category,
            title: data.title,
            slug: data.slug,
            featuredImage: featuredImage, // Use the uploaded image URL
            blogContent: encode(data.blogContent),
            
        })

        await blog.save()
        res.status(201).json({
            success: true,
            message: "Blog added successfully",
            blog
        }); 
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}

export const editBlog = async (req, res,next) => {
    try {
        const { blogid } = req.params;
        const blog = await Blog.findById(blogid).populate('category', 'name'); // Fetch blog by ID and populate category and author fields
        if (!blog) {
            return next(handleError(404, "Category not found"));
        }
        res.status(200).json({
            blog,
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const updateBlog = async (req, res,next) => {
    try{
        const { blogid } = req.params;
        const data = JSON.parse(req.body.data);
        const blog = await Blog.findById(blogid); // Fetch blog by ID and populate category and author fields
        let featuredImage = blog.featuredImage; // Initialize featuredImage variable
        blog.category = data.category; // Update category
        blog.title = data.title; // Update title
        blog.slug = data.slug; // Update slug
        blog.blogContent = encode(data.blogContent); // Update blog content
        if (req.file) {
              // Upload an image
              const uploadResult = await cloudinary.uploader
                .upload(
                  req.file.path, // Path to the image file
                  {folder:'mern-blog',resource_type: 'auto'} // Specify the folder and resource type
                )
                .catch((error) => {
                    next(handleError(500, "Image upload failed: " + error.message)); // Handle image upload errors
                });
        
                featuredImage = uploadResult.secure_url; // Update the user's avatar with the uploaded image URL
            }
        blog.featuredImage = featuredImage; // Use the uploaded image URL

        await blog.save(); // Save the updated blog
        
        res.status(201).json({
            success: true,
            message: "Blog updated successfully",
            blog
        }); 
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}

export const deleteBlog = async (req, res,next) => {
    try {
        const { blogid } = req.params;
         await Blog.findByIdAndDelete(blogid);
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
        
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const showAllBlog = async (req, res,next) => {
    try{
        const user = req.user; // Get the user ID from the request object
        let blog
        if(user.role ==='admin'){
             blog = await Blog.find().populate('author','name avatar role').populate('category','name slug').sort({createdAt: -1}).lean().exec(); // Fetch all blogs and populate author and category fields

        }else{
            blog = await Blog.find({author:user._id}).populate('author','name avatar role').populate('category','name slug').sort({createdAt: -1}).lean().exec(); // Fetch all blogs and populate author and category fields

        }
        res.status(200).json({
            blog
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}

export const getBlog = async(req,res,next)=>{
    try{
        const {slug}= req.params; // Get the slug from the request parameters

        const blog = await Blog.findOne({slug}).populate('author','name avatar role').populate('category','name slug').lean().exec(); // Fetch all blogs and populate author and category fields
        res.status(200).json({
            blog
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}


export const getRelatedBlog = async (req, res,next) => {
    try {
        const { category, blog } = req.params; // Get the category from the request parameters
        const categoryData = await Category.findOne({ slug: category }) // Fetch the category by slug
        if(!categoryData) {
            return next(handleError(404, "Category not found")); // Handle case where category is not found
        }

        const categoryId = categoryData._id; // Get the category ID from the fetched category data
        const relatedBlog = await Blog.find({ category : categoryId ,slug: { $ne: blog }}).lean().exec(); // Fetch blogs by category and populate author and category fields
        res.status(200).json({
            relatedBlog
        });
    
    } catch (error) {
        next(handleError(500, error.message));
        
    }
}


export const getBlogByCategory = async (req, res,next) => {
    try {
        const { category } = req.params; // Get the category from the request parameters
        const categoryData = await Category.findOne({ slug: category }) // Fetch the category by slug
        if(!categoryData) {
            return next(handleError(404, "Category not found")); // Handle case where category is not found
        }

        const categoryId = categoryData._id; // Get the category ID from the fetched category data
        const blog = await Blog.find({ category : categoryId }).populate('author','name avatar role').populate('category','name slug').lean().exec(); // Fetch blogs by category and populate author and category fields
        res.status(200).json({
            blog,categoryData
        });
    
    } catch (error) {
        next(handleError(500, error.message));
        
    }
}


export const search = async (req, res,next) => {
    try {
        const { q } = req.query; // Get the category from the request parameters

        
        const blog = await Blog.find({ title: { $regex: q, $options: 'i' } }).populate('author','name avatar role').populate('category','name slug').lean().exec(); // Fetch blogs by category and populate author and category fields
        res.status(200).json({
            blog
        });
    
    } catch (error) {
        next(handleError(500, error.message));
        
    }
}



export const getAllBlog = async (req, res,next) => {
    try{
        const user = req.user; // Get the user ID from the request object
        const blog = await Blog.find().populate('author','name avatar role').populate('category','name slug').sort({createdAt: -1}).lean().exec(); // Fetch all blogs and populate author and category fields
        res.status(200).json({
            blog
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}