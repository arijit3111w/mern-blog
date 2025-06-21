import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // for hashing passwords

import jwt from "jsonwebtoken"; // for creating JWT tokens

export const Register = async (req, res, next) => {
  // next is passed to use the error handling middleware in app.use in index.js
  try {
    const { name, email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      //user already registered
      next(handleError(409, "User already registered")); // 409 Conflict
    }
    // create new user

    const hashedPassword = bcrypt.hashSync(password); // hash the password with 10 rounds of salt
    const user = new User({
      name,
      email,
      password: hashedPassword, // in real application, we should hash the password before saving it
    });
    await user.save(); // save the user to the database  // we could have also used user.create() instead of new User() and await user.save(), but this is more explicit

    res.status(200).json({
      // 200 Created
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(handleError(500, error.message)); // 500 Internal Server Error
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "Invalid login credentials."));
    }
    const hashedPassword = user.password;

    const comparePassword = await bcrypt.compare(password, hashedPassword);
    if (!comparePassword) {
      return next(handleError(404, "Invalid login credentials."));
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    const newUser = user.toObject({ getters: true });
    delete newUser.password;
    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    let user;
    user = await User.findOne({ email });
    if (!user) {
      // If user does not exist, create a new user
      const password = Math.round(Math.random() * 100000).toString(); // Random numeric password
      const hashedPassword = bcrypt.hashSync(password, 10); // Add salt rounds
      const newUser = new User({
        name,
        email,
        avatar,
        password: hashedPassword, // Hashing email with secret to create a pseudo-password
      });
      user = await newUser.save();
    }
    // If user exists, we can proceed to login

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    const newUser = user.toObject({ getters: true });
    delete newUser.password;
    res.status(200).json({
      success: true,
      user: newUser,
      message: "Login successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};


export const Logout = async (req, res, next) => {
  try {
    

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};



