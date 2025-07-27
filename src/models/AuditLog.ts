import database from '../utils/database';
import { AuditLog, CreateAuditLogRequest, AuditLogFilters, AuditLogListResponse } from '../types/audit';

export class AuditLogModel {
  static async create(auditData: CreateAuditLogRequest): Promise<AuditLog> {
    const { user_id, user_email, action, product_id, details } = auditData;

    const sql = `
      INSERT INTO audit_logs (user_id, user_email, action, product_id, details)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await database.insert(sql, [
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

  static async findById(id: number): Promise<AuditLog | null> {
    const sql = 'SELECT * FROM audit_logs WHERE id = ?';
    const logs = await database.query<AuditLog>(sql, [id]);
    return logs.length > 0 ? logs[0] : null;
  }

  static async findAll(filters: AuditLogFilters = {}): Promise<AuditLogListResponse> {
    const {
      user_id,
      product_id,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = filters;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

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

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM audit_logs 
      ${whereClause}
    `;
    const countResult = await database.query(countSql, params);
    const total = (countResult as any)[0].total;

    // Get logs
    const sql = `
      SELECT * FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const logs = await database.query<AuditLog>(sql, [...params, Number(limit), Number(offset)]);

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

  static async getLogsByUser(userId: number): Promise<AuditLog[]> {
    const sql = `
      SELECT * FROM audit_logs 
      WHERE user_id = ? 
      ORDER BY timestamp DESC
    `;
    return await database.query<AuditLog>(sql, [userId]);
  }

  static async getLogsByProduct(productId: number): Promise<AuditLog[]> {
    const sql = `
      SELECT * FROM audit_logs 
      WHERE product_id = ? 
      ORDER BY timestamp DESC
    `;
    return await database.query<AuditLog>(sql, [productId]);
  }

  static async getLogsByAction(action: AuditLog['action']): Promise<AuditLog[]> {
    const sql = `
      SELECT * FROM audit_logs 
      WHERE action = ? 
      ORDER BY timestamp DESC
    `;
    return await database.query<AuditLog>(sql, [action]);
  }

  static async getRecentLogs(limit: number = 10): Promise<AuditLog[]> {
    const sql = `
      SELECT * FROM audit_logs 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    return await database.query<AuditLog>(sql, [Number(limit)]);
  }

  static async deleteOldLogs(daysOld: number = 365): Promise<void> {
    const sql = `
      DELETE FROM audit_logs 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    await database.query(sql, [daysOld]);
  }

  static async getLogsByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    const sql = `
      SELECT * FROM audit_logs 
      WHERE timestamp BETWEEN ? AND ? 
      ORDER BY timestamp DESC
    `;
    return await database.query<AuditLog>(sql, [startDate, endDate]);
  }

  static async getLogsSummary(): Promise<{
    total: number;
    byAction: Record<string, number>;
    byUser: Record<string, number>;
  }> {
    // Get total count
    const totalResult = await database.query('SELECT COUNT(*) as total FROM audit_logs');
    const total = (totalResult as any)[0].total;

    // Get count by action
    const actionResult = await database.query(`
      SELECT action, COUNT(*) as count 
      FROM audit_logs 
      GROUP BY action
    `);

    // Get count by user
    const userResult = await database.query(`
      SELECT user_email, COUNT(*) as count 
      FROM audit_logs 
      GROUP BY user_email
    `);

    const byAction: Record<string, number> = {};
    const byUser: Record<string, number> = {};

    (actionResult as any[]).forEach((row: any) => {
      byAction[row.action] = row.count;
    });

    (userResult as any[]).forEach((row: any) => {
      byUser[row.user_email] = row.count;
    });

    return { total, byAction, byUser };
  }
}

export default AuditLogModel; 