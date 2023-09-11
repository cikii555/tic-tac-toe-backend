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
const authorize = require('../middleware/authorization');
const bcrypt = require('bcrypt');
const mogoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.get('/me', authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('je li ');
    const user = yield User.findById(req.user._id);
    res.send(user);
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send('User already registered');
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });
    const salt = yield bcrypt.genSalt(10);
    user.password = yield bcrypt.hash(user.password, salt);
    user.save();
    res.send(user);
}));
module.exports = router;
