"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRole = exports.isValidPassword = exports.isValidEmail = void 0;
const client_1 = require("@prisma/client");
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};
exports.isValidPassword = isValidPassword;
const isValidRole = (role) => {
    return Object.values(client_1.Role).includes(role);
};
exports.isValidRole = isValidRole;
