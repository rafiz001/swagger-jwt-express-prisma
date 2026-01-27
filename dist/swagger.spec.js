"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Authentication API',
        version: '1.0.0',
        description: 'API documentation for authentication and authorization system',
        contact: {
            name: 'API Support',
            email: 'support@example.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Development server'
        },
        {
            url: 'https://swagger-jwt-express-prisma.vercel.app/api',
            description: 'Production server'
        }
    ],
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'user@example.com'
                    },
                    firstName: {
                        type: 'string',
                        example: 'John'
                    },
                    lastName: {
                        type: 'string',
                        example: 'Doe'
                    },
                    role: {
                        type: 'string',
                        enum: ['USER', 'MODERATOR', 'ADMIN'],
                        example: 'USER'
                    },
                    isActive: {
                        type: 'boolean',
                        example: true
                    },
                    lastLogin: {
                        type: 'string',
                        format: 'date-time'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },
            RegisterRequest: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'user@example.com'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        minLength: 6,
                        example: 'PassworD123'
                    },
                    firstName: {
                        type: 'string',
                        example: 'John'
                    },
                    lastName: {
                        type: 'string',
                        example: 'Doe'
                    },
                    role: {
                        type: 'string',
                        enum: ['USER', 'MODERATOR', 'ADMIN'],
                        example: 'USER'
                    }
                }
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'user@example.com'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        example: 'PassworD123'
                    }
                }
            },
            RefreshRequest: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                    refreshToken: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    }
                }
            },
            LogoutRequest: {
                type: 'object',
                properties: {
                    refreshToken: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    message: {
                        type: 'string',
                        example: 'Login successful'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            user: {
                                $ref: '#/components/schemas/User'
                            },
                            token: {
                                type: 'string',
                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                            },
                            refreshToken: {
                                type: 'string',
                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                            }
                        }
                    }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    message: {
                        type: 'string',
                        example: 'Invalid credentials'
                    },
                    error: {
                        type: 'string',
                        example: 'Detailed error message in development'
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        responses: {
            UnauthorizedError: {
                description: 'Missing or invalid authentication token',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            success: false,
                            message: 'Not authenticated'
                        }
                    }
                }
            },
            ForbiddenError: {
                description: 'Insufficient permissions',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            success: false,
                            message: 'Insufficient permissions'
                        }
                    }
                }
            },
            ValidationError: {
                description: 'Validation failed',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse'
                        },
                        example: {
                            success: false,
                            message: 'Validation failed',
                            error: 'Email is required'
                        }
                    }
                }
            }
        }
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and authorization endpoints'
        }
    ],
    paths: {
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                description: 'Creates a new user account',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RegisterRequest'
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Bad request (validation error or user exists)',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                description: 'Authenticate user and return JWT tokens',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/LoginRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Invalid credentials',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/refresh': {
            post: {
                tags: ['Authentication'],
                summary: 'Refresh access token',
                description: 'Generate new access token using refresh token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RefreshRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Token refreshed successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Refresh token required',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Invalid or expired refresh token',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/logout': {
            post: {
                tags: ['Authentication'],
                summary: 'Logout user',
                description: 'Invalidate refresh token and log logout action',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/LogoutRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Logout successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Logout successful'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/profile': {
            get: {
                tags: ['Authentication'],
                summary: 'Get user profile',
                description: 'Retrieve authenticated user\'s profile information',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'Profile retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        data: {
                                            $ref: '#/components/schemas/User'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        $ref: '#/components/responses/UnauthorizedError'
                    },
                    '404': {
                        description: 'User not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/admin': {
            get: {
                tags: ['Authentication'],
                summary: 'Admin only endpoint',
                description: 'Endpoint accessible only to users with ADMIN role',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successfully accessed admin endpoint',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Welcome Admin!'
                                        },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                userId: {
                                                    type: 'string',
                                                    example: '123e4567-e89b-12d3-a456-426614174000'
                                                },
                                                email: {
                                                    type: 'string',
                                                    example: 'admin@example.com'
                                                },
                                                role: {
                                                    type: 'string',
                                                    example: 'ADMIN'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        $ref: '#/components/responses/UnauthorizedError'
                    },
                    '403': {
                        $ref: '#/components/responses/ForbiddenError'
                    }
                }
            }
        },
        '/auth/moderator': {
            get: {
                tags: ['Authentication'],
                summary: 'Moderator/Admin endpoint',
                description: 'Endpoint accessible to users with MODERATOR or ADMIN role',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'Successfully accessed moderator endpoint',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Welcome Moderator/Admin!'
                                        },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                userId: {
                                                    type: 'string',
                                                    example: '123e4567-e89b-12d3-a456-426614174000'
                                                },
                                                email: {
                                                    type: 'string',
                                                    example: 'moderator@example.com'
                                                },
                                                role: {
                                                    type: 'string',
                                                    example: 'MODERATOR'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        $ref: '#/components/responses/UnauthorizedError'
                    },
                    '403': {
                        $ref: '#/components/responses/ForbiddenError'
                    }
                }
            }
        }
    }
};
exports.default = swaggerSpec;
