import express from 'express';
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js';
import Category from '../models/category.model.js';
import { onlyadmin } from '../middleware/onlyadmin.js';



const CategoryRoute = express.Router();

CategoryRoute.post('/add', onlyadmin, addCategory ); // add category route
CategoryRoute.put('/update/:categoryid', onlyadmin, updateCategory ); // update category route
CategoryRoute.get('/show/:categoryid', onlyadmin, showCategory ); // show 
CategoryRoute.delete('/delete/:categoryid', onlyadmin, deleteCategory ); // Register route

CategoryRoute.get('/all-category',getAllCategory)



export default CategoryRoute;