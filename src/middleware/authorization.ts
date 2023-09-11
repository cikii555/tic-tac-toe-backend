import {Request,Response,NextFunction} from "express"
const jwt = require('jsonwebtoken')
const secretJWTKey = process.env.JWT_SECRET

function authorize(req:any,res:Response,next:NextFunction){
    console.log('usao')
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send('Access denied. No token provided')
    try{
        const decoded =jwt.verify(token,secretJWTKey)
        req.user = decoded
        next()
    }
    catch(ex){
        res.status(400).send('Invalid token ')
    }

}
module.exports = authorize