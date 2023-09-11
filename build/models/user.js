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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const jwt = require('jsonwebtoken');
const secretJWTKey = process.env.JWT_SECRET;
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 1024,
    },
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255,
    },
});
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign({ username: this.username, _id: this._id }, secretJWTKey);
        return token;
    });
};
const User = mongoose_1.default.model('User', userSchema);
function validateUser(user) {
    const schema = {
        name: joi_1.default.string().min(3).max(55).required(),
        email: joi_1.default.string().min(5).max(55).required(),
    };
    return joi_1.default.valid(user, schema);
}
module.exports = { User, validateUser };
