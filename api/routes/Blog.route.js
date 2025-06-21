import express from "express";
import Blog from "../models/blog.model.js";
import {
  addBlog,
  deleteBlog,
  editBlog,
  getAllBlog,
  getBlog,
  getBlogByCategory,
  getRelatedBlog,
  search,
  showAllBlog,
  updateBlog,
} from "../controllers/Blog.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const BlogRoute = express.Router();

BlogRoute.post("/add", authenticate, upload.single("file"), addBlog); // add blog
BlogRoute.get("/edit/:blogid", authenticate, editBlog); // get blog by id
BlogRoute.put(
  "/update/:blogid",
  authenticate,
  upload.single("file"),
  updateBlog
); // update blog by id
BlogRoute.delete("/delete/:blogid", authenticate, deleteBlog); // delete blog by id

BlogRoute.get("/get-all",authenticate, showAllBlog); // get all blogs



// publics for all

BlogRoute.get("/get-blog/:slug", getBlog); // get all blogs

BlogRoute.get("/get-related-blog/:category/:blog", getRelatedBlog); // get all blogs

BlogRoute.get("/get-blog-by-category/:category", getBlogByCategory); // get all blogs

BlogRoute.get("/search", search); // get all blogs

BlogRoute.get("/blogs", getAllBlog); // get all blogs

export default BlogRoute;
