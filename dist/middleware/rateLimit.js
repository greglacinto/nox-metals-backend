"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimit = exports.createRateLimitErrorHandler = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const createRateLimitErrorHandler = (endpoint) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            if (res.statusCode === 429) {
                console.warn(`Rate limit exceeded for ${endpoint} from IP: ${req.ip}`);
                console.log({
                    endpoint,
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    timestamp: new Date().toISOString(),
                    headers: req.headers
                });
            }
            return originalSend.call(this, data);
        };
        next();
    };
};
exports.createRateLimitErrorHandler = createRateLimitErrorHandler;
const createRateLimit = (options) => {
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: options.windowMs,
        max: options.max,
        message: {
            success: false,
            message: options.message,
            endpoint: options.endpoint
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            console.warn(`Rate limit exceeded for ${options.endpoint || 'unknown'} from IP: ${req.ip}`);
            res.status(429).json({
                success: false,
                message: options.message,
                endpoint: options.endpoint,
                retryAfter: Math.ceil(options.windowMs / 1000)
            });
        }
    });
    return limiter;
};
exports.createRateLimit = createRateLimit;
//# sourceMappingURL=rateLimit.js.map