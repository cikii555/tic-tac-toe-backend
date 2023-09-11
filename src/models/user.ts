
import mongoose  from "mongoose"
import Joi from "joi"
const jwt  = require('jsonwebtoken')

const secretJWTKey = process.env.JWT_SECRET

const userSchema = new  mongoose.Schema({
    name:{
        type: String,
        required:true,
        minLength:3,
        maxLength:255
    },
    email:{
        type: String,
        required:true,
        minLength:3,
        maxLength:255,
        unique: true 
    },
    password:{
        type: String,
        required:true,
        minLength:3,
        maxLength:1024,
         
    },
    username:{
        type: String,
        required:true,
        minLength:3,
        maxLength:255,
         
    },
})
userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({username:this.username,email:this.email},secretJWTKey)
    return token
}
const User  = mongoose.model('User', userSchema)


function validateUser(user:any){
    const schema={
        name: Joi.string().min(3).max(55).required(),
        email: Joi.string().min(5).max(55).required(),
    }
    return Joi.valid(user,schema)
}

export = {User,validateUser}
