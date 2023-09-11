"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const User = mongoose_1.default.model('User', new mongoose_1.default.Schema({
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
}));
function validateUser(user) {
    const schema = {
        name: joi_1.default.string().min(3).max(55).required(),
        email: joi_1.default.string().min(5).max(55).required(),
    };
    return joi_1.default.valid(user, schema);
}
module.exports = { User, validateUser };
