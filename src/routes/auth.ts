import { Request,Response } from "express";
const {User,validateUser}=require('../models/user')
const config = require('config')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const express = require('express')
const crypto = require('crypto');
const router = express.Router()



router.post('/',async (req:Request,res:Response)=>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({username:req.body.username})
    if (!user) return res.status(400).send('Invalid username or password')
    const validPassword =bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = await  user.generateAuthToken()
    res.header('x-auth-token',token)
    res.send(user)
})

function validate(req:Request){
    const schema =Joi.object({
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(req)
}
module.exports = router
