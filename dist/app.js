"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./utils/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const audit_1 = __importDefault(require("./routes/audit"));
const users_1 = __importDefault(require("./routes/users"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5'),
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', authLimiter);
app.use('/api/', generalLimiter);
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Nox Metals API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/audit', audit_1.default);
app.use('/api/users', users_1.default);
app.use('/api/upload', upload_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    if (error.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
        });
        return;
    }
    if (error.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
        return;
    }
    if (error.name === 'ForbiddenError') {
        res.status(403).json({
            success: false,
            message: 'Access forbidden'
        });
        return;
    }
    res.status(error.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message || 'Something went wrong'
    });
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await database_1.default.disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await database_1.default.disconnect();
    process.exit(0);
});
const startServer = async () => {
    try {
        await database_1.default.connect();
        app.listen(PORT, () => {
            console.log(`🚀 Nox Metals API server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map