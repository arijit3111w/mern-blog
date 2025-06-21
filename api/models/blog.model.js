import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to the user model
      ref: "User", // this should match the name of the model you are referencing
      required: true, // author is required
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to the category model
      ref: "Category", // this should match the name of the model you are referencing
      required: true, // category is required
    },
    title: {
      type: String,
      required: true,
      trim: true, // removes extra spaces from the beginning and end
    },
    slug: {
      type: String,
      required: true,
      unique: true, // email should be unique
      trim: true, // removes extra spaces from the beginning and end
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true, // removes extra spaces from the beginning and end
    },
    blogContent: {
      type: String,
      required: true,
      trim: true, // removes extra spaces from the beginning and end
    },
  },
  { timestamps: true }
); // timestamps will add createdAt and updatedAt fields automatically

const Blog = mongoose.model("Blog", blogSchema, "blogs");
export default Blog;
