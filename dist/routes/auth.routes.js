"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', validation_1.validateRegister, auth_controller_1.register);
router.post('/login', validation_1.validateLogin, auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.post('/logout', auth_controller_1.logout);
// Protected routes
router.get('/profile', auth_1.authenticate, auth_controller_1.getProfile);
// Admin only routes
router.get('/admin', auth_1.authenticate, (0, auth_1.authorize)(client_1.Role.ADMIN), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome Admin!',
        user: req.user
    });
});
// Moderator or Admin routes
router.get('/moderator', auth_1.authenticate, (0, auth_1.authorize)(client_1.Role.ADMIN, client_1.Role.MODERATOR), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome Moderator/Admin!',
        user: req.user
    });
});
exports.default = router;
