"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.validateToken = exports.generateRefreshToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (payload) => {
    // Explicitly cast the options to avoid TypeScript issues
    const options = {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256'
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
};
exports.verifyToken = verifyToken;
const generateRefreshToken = () => {
    return require('crypto').randomBytes(40).toString('hex');
};
exports.generateRefreshToken = generateRefreshToken;
// Optional: Add token validation
const validateToken = (token) => {
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return true;
    }
    catch {
        return false;
    }
};
exports.validateToken = validateToken;
// Optional: Decode token without verification
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
