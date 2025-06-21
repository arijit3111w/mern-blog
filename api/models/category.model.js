import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true, // removes extra spaces from the beginning and end
    },
    slug:{
        type: String,
        required: true,
        unique: true, // email should be unique
        trim: true, // removes extra spaces from the beginning and end
    },
   
})  

const Category = mongoose.model('Category', categorySchema ,'categories');
export default Category;