"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
class JWTService {
    static generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log('🔑 Generated token with expiration:', JWT_EXPIRES_IN);
        return token;
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log('🔍 Token verified successfully, expires at:', new Date(decoded.exp * 1000));
            return decoded;
        }
        catch (error) {
            console.log('❌ Token verification failed:', error);
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error('Token expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            else {
                throw new Error('Token verification failed');
            }
        }
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
    static isTokenExpired(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || !decoded.exp)
                return true;
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        }
        catch (error) {
            return true;
        }
    }
}
exports.JWTService = JWTService;
exports.default = JWTService;
//# sourceMappingURL=jwt.js.map