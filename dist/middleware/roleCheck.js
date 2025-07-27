"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalRole = exports.requireUser = exports.requireAdmin = exports.requireRole = void 0;
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        if (req.user.role !== requiredRole && req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: `Access denied. ${requiredRole} role required.`
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireUser = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    next();
};
exports.requireUser = requireUser;
const optionalRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role !== requiredRole && req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: `Access denied. ${requiredRole} role required.`
            });
            return;
        }
        next();
    };
};
exports.optionalRole = optionalRole;
//# sourceMappingURL=roleCheck.js.map