"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogModel = void 0;
const database_1 = __importDefault(require("../utils/database"));
class AuditLogModel {
    static async create(auditData) {
        const { user_id, user_email, action, product_id, details } = auditData;
        const sql = `
      INSERT INTO audit_logs (user_id, user_email, action, product_id, details)
      VALUES (?, ?, ?, ?, ?)
    `;
        const result = await database_1.default.insert(sql, [
            user_id || null,
            user_email,
            action,
            product_id || null,
            details ? JSON.stringify(details) : null
        ]);
        const logId = result.insertId;
        const log = await this.findById(logId);
        if (!log) {
            throw new Error('Failed to create audit log');
        }
        return log;
    }
    static async findById(id) {
        const sql = 'SELECT * FROM audit_logs WHERE id = ?';
        const logs = await database_1.default.query(sql, [id]);
        return logs.length > 0 ? logs[0] : null;
    }
    static async findAll(filters = {}) {
        const { user_id, product_id, action, startDate, endDate, page = 1, limit = 50 } = filters;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const params = [];
        if (user_id) {
            whereClause += ' AND user_id = ?';
            params.push(user_id);
        }
        if (product_id) {
            whereClause += ' AND product_id = ?';
            params.push(product_id);
        }
        if (action) {
            whereClause += ' AND action = ?';
            params.push(action);
        }
        if (startDate) {
            whereClause += ' AND timestamp >= ?';
            params.push(startDate);
        }
        if (endDate) {
            whereClause += ' AND timestamp <= ?';
            params.push(endDate);
        }
        const countSql = `
      SELECT COUNT(*) as total 
      FROM audit_logs 
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countSql, params);
        const total = countResult[0].total;
        const sql = `
      SELECT * FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
        const logs = await database_1.default.query(sql, [...params, Number(limit), Number(offset)]);
        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async getLogsByUser(userId) {
        const sql = `
      SELECT * FROM audit_logs 
      WHERE user_id = ? 
      ORDER BY timestamp DESC
    `;
        return await database_1.default.query(sql, [userId]);
    }
    static async getLogsByProduct(productId) {
        const sql = `
      SELECT * FROM audit_logs 
      WHERE product_id = ? 
      ORDER BY timestamp DESC
    `;
        return await database_1.default.query(sql, [productId]);
    }
    static async getLogsByAction(action) {
        const sql = `
      SELECT * FROM audit_logs 
      WHERE action = ? 
      ORDER BY timestamp DESC
    `;
        return await database_1.default.query(sql, [action]);
    }
    static async getRecentLogs(limit = 10) {
        const sql = `
      SELECT * FROM audit_logs 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
        return await database_1.default.query(sql, [Number(limit)]);
    }
    static async deleteOldLogs(daysOld = 365) {
        const sql = `
      DELETE FROM audit_logs 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
        await database_1.default.query(sql, [daysOld]);
    }
    static async getLogsByDateRange(startDate, endDate) {
        const sql = `
      SELECT * FROM audit_logs 
      WHERE timestamp BETWEEN ? AND ? 
      ORDER BY timestamp DESC
    `;
        return await database_1.default.query(sql, [startDate, endDate]);
    }
    static async getLogsSummary() {
        const totalResult = await database_1.default.query('SELECT COUNT(*) as total FROM audit_logs');
        const total = totalResult[0].total;
        const actionResult = await database_1.default.query(`
      SELECT action, COUNT(*) as count 
      FROM audit_logs 
      GROUP BY action
    `);
        const userResult = await database_1.default.query(`
      SELECT user_email, COUNT(*) as count 
      FROM audit_logs 
      GROUP BY user_email
    `);
        const byAction = {};
        const byUser = {};
        actionResult.forEach((row) => {
            byAction[row.action] = row.count;
        });
        userResult.forEach((row) => {
            byUser[row.user_email] = row.count;
        });
        return { total, byAction, byUser };
    }
}
exports.AuditLogModel = AuditLogModel;
exports.default = AuditLogModel;
//# sourceMappingURL=AuditLog.js.map