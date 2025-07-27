"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
class AuditController {
    static async getAllLogs(req, res) {
        try {
            const filters = {
                user_id: req.query.user_id ? parseInt(req.query.user_id) : undefined,
                product_id: req.query.product_id ? parseInt(req.query.product_id) : undefined,
                action: req.query.action,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 50
            };
            const result = await AuditLog_1.default.findAll(filters);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch audit logs'
            });
        }
    }
    static async getLogsByProduct(req, res) {
        try {
            const { id } = req.params;
            const productId = parseInt(id);
            const logs = await AuditLog_1.default.getLogsByProduct(productId);
            res.json({
                success: true,
                data: { logs }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch product audit logs'
            });
        }
    }
    static async getLogsByUser(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id);
            const logs = await AuditLog_1.default.getLogsByUser(userId);
            res.json({
                success: true,
                data: { logs }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user audit logs'
            });
        }
    }
    static async getLogsByAction(req, res) {
        try {
            const { action } = req.params;
            const logs = await AuditLog_1.default.getLogsByAction(action);
            res.json({
                success: true,
                data: { logs }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch action audit logs'
            });
        }
    }
    static async getRecentLogs(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const logs = await AuditLog_1.default.getRecentLogs(limit);
            res.json({
                success: true,
                data: { logs }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch recent audit logs'
            });
        }
    }
    static async getLogsSummary(req, res) {
        try {
            const summary = await AuditLog_1.default.getLogsSummary();
            res.json({
                success: true,
                data: { summary }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch audit logs summary'
            });
        }
    }
    static async getLogsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
                return;
            }
            const logs = await AuditLog_1.default.getLogsByDateRange(new Date(startDate), new Date(endDate));
            res.json({
                success: true,
                data: { logs }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch date range audit logs'
            });
        }
    }
}
exports.default = AuditController;
//# sourceMappingURL=auditController.js.map