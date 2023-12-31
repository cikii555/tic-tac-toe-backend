"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const secretJWTKey = process.env.JWT_SECRET;
function authorize(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Access denied. No token provided');
    try {
        const decoded = jwt.verify(token, secretJWTKey);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token ');
    }
}
module.exports = authorize;
