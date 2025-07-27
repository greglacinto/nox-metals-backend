"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
class AuthController {
    static async signup(req, res) {
        try {
            const { email, password, role = 'user' } = req.body;
            const user = await User_1.default.create({ email, password, role });
            const token = jwt_1.default.generateToken(user);
            await AuditLog_1.default.create({
                user_id: user.id,
                user_email: user.email,
                action: 'LOGIN',
                details: { action: 'signup', role }
            });
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user,
                    token
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create user'
                });
            }
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.authenticate({ email, password });
            await User_1.default.updateLastLogin(user.id);
            const token = jwt_1.default.generateToken(user);
            await AuditLog_1.default.create({
                user_id: user.id,
                user_email: user.email,
                action: 'LOGIN',
                details: { action: 'login' }
            });
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Login failed'
                });
            }
        }
    }
    static async logout(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            await AuditLog_1.default.create({
                user_id: req.user.id,
                user_email: req.user.email,
                action: 'LOGOUT',
                details: { action: 'logout' }
            });
            res.json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
    }
    static async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            res.json({
                success: true,
                data: {
                    user: req.user
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get current user'
            });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map