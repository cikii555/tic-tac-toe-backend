import { Request ,Response } from "express"
const {User,validateUser}=require('../models/user')
const bcrypt = require('bcrypt')
const mogoose = require('mongoose')
const express = require('express')
const router = express.Router()




router.post('/register',async (req:Request,res:Response)=>{

    let user  = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('User already registered')

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password,salt)

    user.save()
    res.send(user)
})
module.exports = router