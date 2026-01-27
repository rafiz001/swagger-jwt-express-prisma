"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables FIRST
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// 1. Basic middleware without any patterns first
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 2. Test with NO CORS first
// app.use(cors()) // Comment out for now
// 3. Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});
// 4. Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// 5. Import and use routes ONE BY ONE
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
app.use('/api/auth', auth_routes_1.default);
// 6. 404 handler - Fix this pattern
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.originalUrl
    });
});
// 7. Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`🔗 Test: http://localhost:${PORT}/test`);
    console.log(`🔗 Health: http://localhost:${PORT}/health`);
});
exports.default = app;
