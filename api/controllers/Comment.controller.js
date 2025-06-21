import { handleError } from "../helpers/handleError.js";
import Comment from "../models/comment.model.js";


export const addComment = async (req, res,next) => {
   try{
        const {user, blogid, comment} = req.body; // Extract author, blogId, and comment from request body
        const newComment = new Comment({
            user: user, // Comment text
            blogid: blogid, // Blog ID to which the comment belongs
            comment: comment, // Comment text
        });

        await newComment.save(); // Save the new comment to the database
        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment // Return the newly created comment
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}


export const getComments = async (req, res,next) => {
   try{
        const { blogid } = req.params; // Extract blogId from request parameters
        const comments = await Comment.find({ blogid }) // Find all comments for the specified blogId
        .populate('user', 'name avatar role') // Populate author details
            .sort({ createdAt: -1 }) // Sort comments by creation date in descending order
            .lean() // Convert to plain JavaScript objects
            .exec(); // Execute the query

        res.status(200).json({
            comment: comments // Return the newly created comment
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}

export const commentCount = async (req, res,next) => {
   try{
        const { blogid } = req.params; // Extract blogId from request parameters
        const commentCount = await Comment.countDocuments({ blogid }); // Count the number of comments for the specified blogId

        res.status(200).json({
            commentCount // Return the count of comments
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}



export const getAllComments = async (req, res,next) => {
   try{

        const user = req.user; // Get the user ID from the request object
        // If the user is an admin, fetch all comments; otherwise, fetch only the user's comments
        let comments;
        if(user.role === 'admin'){
         comments = await Comment.find() // Find all comments
            .populate('user', 'name avatar role') // Populate author details
            .populate('blogid', 'title') // Populate blog title
            .sort({ createdAt: -1 }) // Sort comments by creation date in descending order
            .lean() // Convert to plain JavaScript objects
            .exec(); // Execute the query
        }else{
            comments = await Comment.find({user:user._id}) // Find all comments by the user
            .populate('user', 'name avatar role') // Populate author details
            .populate('blogid', 'title') // Populate blog title
            .sort({ createdAt: -1 }) // Sort comments by creation date in descending order
            .lean() // Convert to plain JavaScript objects
            .exec(); // Execute the query
        }
        res.status(200).json({
            comments
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}


export const deleteComment = async (req, res,next) => {
   try{

        const {commentid} = req.params; // Extract commentId from request parameters
        await Comment.findByIdAndDelete(commentid); // Find and delete the comment by its ID

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }catch(err){
        next(handleError(500, err.message || "Internal Server Error"));
    }
}

