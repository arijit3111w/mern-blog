import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role:{
        type: String,
        default: 'user',
        enum: ['user', 'admin'] , // only these two roles are allowed
        required: true,
        trim: true, // removes extra spaces from the beginning and end
    },
    name:{
        type: String,
        required: true,
        trim: true, // removes extra spaces from the beginning and end
    },
    email:{
        type: String,
        required: true,
        unique: true, // email should be unique
        trim: true, // removes extra spaces from the beginning and end
    },
    bio:{
        type: String,
        default: '',
        trim: true, // removes extra spaces from the beginning and end
    },
    avatar:{
        type: String,
        default: '',
        trim: true, // removes extra spaces from the beginning and end
    },
    password:{
        type: String,
        required: true,
        trim: true, // removes extra spaces from the beginning and end
    },
})  

const User = mongoose.model('User', userSchema ,'users');
export default User;