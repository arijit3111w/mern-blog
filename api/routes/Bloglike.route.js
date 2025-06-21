import express from 'express';
import { doLike, likeCount } from '../controllers/BlogLike.controller.js';
import { authenticate } from '../middleware/authenticate.js';




const BlogLikeRoute = express.Router();

BlogLikeRoute.post('/do-like',authenticate, doLike ); // add category route

BlogLikeRoute.get('/get-like/:blogid', likeCount); // add category route



export default BlogLikeRoute;