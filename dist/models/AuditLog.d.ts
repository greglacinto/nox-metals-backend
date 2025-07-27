import { AuditLog, CreateAuditLogRequest, AuditLogFilters, AuditLogListResponse } from '../types/audit';
export declare class AuditLogModel {
    static create(auditData: CreateAuditLogRequest): Promise<AuditLog>;
    static findById(id: number): Promise<AuditLog | null>;
    static findAll(filters?: AuditLogFilters): Promise<AuditLogListResponse>;
    static getLogsByUser(userId: number): Promise<AuditLog[]>;
    static getLogsByProduct(productId: number): Promise<AuditLog[]>;
    static getLogsByAction(action: AuditLog['action']): Promise<AuditLog[]>;
    static getRecentLogs(limit?: number): Promise<AuditLog[]>;
    static deleteOldLogs(daysOld?: number): Promise<void>;
    static getLogsByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
    static getLogsSummary(): Promise<{
        total: number;
        byAction: Record<string, number>;
        byUser: Record<string, number>;
    }>;
}
export default AuditLogModel;
//# sourceMappingURL=AuditLog.d.ts.map