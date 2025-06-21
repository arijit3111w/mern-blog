import express from 'express';
import { addComment, commentCount, deleteComment, getAllComments, getComments } from '../controllers/Comment.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { onlyadmin } from '../middleware/onlyadmin.js';




const CommentRoute = express.Router();

CommentRoute.post('/add',authenticate, addComment ); // add category route

CommentRoute.get('/get/:blogid', getComments ); // add category route


CommentRoute.get('/get-count/:blogid', commentCount ); // add category route

CommentRoute.get('/get-all-comment',authenticate, getAllComments ); // add category route

CommentRoute.delete('/delete/:commentid',authenticate, deleteComment ); // add category route


export default CommentRoute;