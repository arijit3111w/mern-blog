import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import mongoose from 'mongoose';
import AuthRoute from './routes/Auth.route.js';
import UserRoute from './routes/User.route.js';
import CategoryRoute from './routes/Category.route.js';
import BlogRoute from './routes/Blog.route.js';
import CommentRoute from './routes/Comment.route.js';
import BlogLikeRoute from './routes/Bloglike.route.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());  // jab hum frontend se api request karenge tab cookie bhi send ho backend me
// parses data from the cookie sent by frontend data 

app.use(express.json()); // parses json data from the request body

app.use(cors({
    origin: process.env.FRONTEND_URL, // allow requests from the frontend URL
    credentials: true, // allow cookies to be sent with requests
}))

app.use('/api/auth', AuthRoute)   // route setup for frontend integration
app.use('/api/user', UserRoute) // route setup for user related operations
app.use('/api/category', CategoryRoute) // route setup for category related operations
app.use('/api/blog', BlogRoute) // route setup for blog related operations
app.use('/api/comment', CommentRoute)
app.use('/api/blog-like',BlogLikeRoute)



// connect to database 
mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'mern-blog',
}
).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use((err,req,res,next)=>{     // middleware to handle error after creating handleError.js
    const statusCode = err.statusCode || 500; // if statusCode is not set, default to 500
    const message = err.message || 'Internal Server Error'; // if message is not set, default to 'Internal Server Error'
    res.status(statusCode).json({ 
        success: false,
        statusCode,
        message 
    }); // send error response
})