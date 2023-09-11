"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User', new mongoose_1.default.Schema({
    name: String
}));
module.exports = { User };
