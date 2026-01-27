"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const validators_1 = require("../utils/validators");
const validateRegister = (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    if (!(0, validators_1.isValidEmail)(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }
    if (!(0, validators_1.isValidPassword)(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
        });
    }
    if (role && !(0, validators_1.isValidRole)(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role specified'
        });
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }
    next();
};
exports.validateLogin = validateLogin;
