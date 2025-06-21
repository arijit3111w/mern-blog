import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // for hashing passwords

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec(); // Find user by ID
    if (!user) {
      next(handleError(404, "User not found")); // If user not found, return 404 error
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data); // Parse the JSON data from the request body
    const { userid } = req.params; // Get the user ID from the request parameters

    const user = await User.findById(userid); // Find the user by ID
    user.name = data.name; // Update the user's name
    user.email = data.email; // Update the user's email
    user.bio = data.bio; // Update the user's bio

    if (data.password && data.password.length >= 6) {
      // If a password is provided, hash it and update the user's password
      const hashedPassword = bcrypt.hashSync(data.password); // Hash the password with 10 rounds of salt
      user.password = hashedPassword; // Hash the password with 10 rounds of salt
    }

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

        user.avatar = uploadResult.secure_url; // Update the user's avatar with the uploaded image URL
    }

    await user.save(); // Save the updated user to the database

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: newUser,
    });
  } catch (error) {
    next(handleError(500, error.message)); // Handle error and pass it to the error handler
  }
};


export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find() // Find all users
      .select("-password") // Exclude the password field
      .sort({ createdAt: -1 }) // Sort users by creation date in descending order
      .lean() // Convert to plain JavaScript objects
      .exec(); // Execute the query

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      user,
    });
  } catch (error) {
    next(handleError(500, error.message || "Internal Server Error")); // Handle error and pass it to the error handler
  }
}

export const deleteUser= async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters
    const user = await User.findByIdAndDelete(id); // Find and delete the user by ID

    if (!user) {
      return next(handleError(404, "User not found")); // If user not found, return 404 error
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(handleError(500, error.message || "Internal Server Error")); // Handle error and pass it to the error handler
  }
}