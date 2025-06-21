import { handleError } from "../helpers/handleError.js";
import jwt from "jsonwebtoken";

export const onlyadmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(handleError(403, "Unauthorized access"));
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodeToken.role === 'admin') {
        req.user = decodeToken; // Attach the decoded token to the request object
        next();
      
    }else{
        return next(handleError(403, "Access denied: Admins only"));
    }
    

    next();
  } catch (error) {
     next(handleError(500, error.message || "Internal Server Error"));
  }
};
