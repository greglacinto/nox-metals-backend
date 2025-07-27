"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.optionalAuth = exports.authenticateToken = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const User_1 = __importDefault(require("../models/User"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const payload = jwt_1.default.verifyToken(token);
        const user = await User_1.default.findById(payload.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const payload = jwt_1.default.verifyToken(token);
            const user = await User_1.default.findById(payload.userId);
            if (user) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const requireAuth = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map