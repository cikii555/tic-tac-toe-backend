"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { User, validateUser } = require('../models/user');
const config = require('config');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield User.findOne({ username: req.body.username });
    if (!user)
        return res.status(400).send('Invalid username or password');
    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send('Invalid email or password');
    const token = yield user.generateAuthToken();
    res.header('x-auth-token', token);
    res.send(user);
}));
function validate(req) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}
module.exports = router;
