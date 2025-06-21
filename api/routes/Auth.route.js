import express from 'express';
import { GoogleLogin, Login, Logout, Register } from '../controllers/Auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const AuthRoute = express.Router();

AuthRoute.post('/register', Register ); // Register route
                                                        // api endpoints done
AuthRoute.post('/login',Login ) // Login route    

AuthRoute.post('/google-login', GoogleLogin);

AuthRoute.get('/logout',authenticate ,Logout); // Logout route


export default AuthRoute;


