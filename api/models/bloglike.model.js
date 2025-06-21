import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to the user model
      ref: "User", // this should match the name of the model you are referencing
      required: true, // author is required
    },
    blogid: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to the category model
      ref: "Blog", // this should match the name of the model you are referencing
      required: true, // category is required
    },
  },
  { timestamps: true }
); // timestamps will add createdAt and updatedAt fields automatically

const BlogLike = mongoose.model("Like", likeSchema, "bloglikes");
export default BlogLike;
