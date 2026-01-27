"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const swagger_spec_1 = __importDefault(require("./swagger.spec"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
// Other middleware
// app.use(helmet())
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Required for inline Swagger UI script
                "https://cdn.jsdelivr.net", // Allow CDN scripts
                "https://unpkg.com" // Alternative CDN
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // Required for inline styles
                "https://cdn.jsdelivr.net",
                "https://fonts.googleapis.com",
                "https://unpkg.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdn.jsdelivr.net",
                "https://unpkg.com",
                "data:" // Required for Swagger UI fonts
            ],
            imgSrc: [
                "'self'",
                "data:", // Required for Swagger UI images
                "https://cdn.jsdelivr.net",
                "https://unpkg.com"
            ],
            connectSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://unpkg.com"
            ]
        }
    },
    crossOriginEmbedderPolicy: false, // Disable for Swagger UI
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resources
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger UI
// Serve static HTML with inline Swagger UI
app.get('/api/api-docs', (req, res) => {
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css" />
    <style>
      body { margin: 0; padding: 0; }
      #swagger-ui { padding: 20px; }
      .swagger-ui .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
    <script>
      const spec = ${JSON.stringify(swagger_spec_1.default, null, 2)};
      
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          spec,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: "StandaloneLayout"
        });
      };
    </script>
  </body>
  </html>
  `;
    res.send(html);
});
// Serve Swagger JSON specification
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swagger_spec_1.default);
});
// Routes
app.use('/api/auth', auth_routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Auth API'
    });
});
/*
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})
*/
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
