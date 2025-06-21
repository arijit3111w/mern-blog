import { handleError } from "../helpers/handleError.js";
import BlogLike from "../models/bloglike.model.js";


export const doLike = async (req, res, next) => {
  try {
    const { userid, blogid } = req.body; // ✅ use `userid` to match schema

    let like = await BlogLike.findOne({ userid, blogid });

    if (!like) {
      const saveLike = new BlogLike({ userid, blogid });
      like = await saveLike.save();
    } else {
      await BlogLike.findByIdAndDelete(like._id);
    }

    const likeCount = await BlogLike.countDocuments({ blogid });

    res.status(200).json({ likeCount });
  } catch (error) {
    next(handleError(500, error.message || "Internal Server Error"));
  }
};


export const likeCount = async (req, res, next) => {
    try {
        const { blogid } = req.params; // Extract blogId from request parameters
        const { userid } = req.query; // Extract userid from query parameters (if provided)

        const likeCount = await BlogLike.countDocuments({ blogid }); // Count the number of likes for the specified blogId
        let isUserLiked = false; // Initialize a variable to check if the user has liked the blog
        
        if(userid){
            const getuserlike = await BlogLike.countDocuments({ blogid, userid }); // Count the number of likes for the specified blogId by the user
            if(getuserlike>0){
                isUserLiked = true; // If the user has liked the blog, set isUserLiked to true
            }
        }
        res.status(200).json({
            likeCount // Return the count of likes
            ,isUserLiked
        });
        
    } catch (error) {
        next(handleError(500, error.message || "Internal Server Error"));
    }
}