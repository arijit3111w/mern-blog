import express from 'express';
import { deleteUser, getAllUser, getUser, updateUser } from '../controllers/User.controller.js';
import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';



const UserRoute = express.Router();

UserRoute.use(authenticate)

UserRoute.get('/get-user/:userid', getUser ); // Register route
UserRoute.put('/update-user/:userid',upload.single('file'),updateUser ); // Update user route

UserRoute.get('/get-all-user', getAllUser ); // Register route


UserRoute.delete('/delete/:id', deleteUser ); // Register route

export default UserRoute;


