import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to the user model
      ref: "User", // this should match the name of the model you are referencing
      required: true, // author is required
    },
    blogid: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to the category model
      ref: "Blog", // this should match the name of the model you are referencing
      required: true, // category is required
    },
    comment: {
      type: String,
      required: true,
      trim: true, // removes extra spaces from the beginning and end
    },
  },
  { timestamps: true }
); // timestamps will add createdAt and updatedAt fields automatically

const Comment = mongoose.model("Comment", commentSchema, "comments");
export default Comment;
