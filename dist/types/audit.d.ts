export interface AuditLog {
    id: number;
    user_id: number | null;
    user_email: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'LOGIN' | 'LOGOUT';
    product_id: number | null;
    details: Record<string, any> | null;
    timestamp: Date;
}
export interface CreateAuditLogRequest {
    user_id?: number;
    user_email: string;
    action: AuditLog['action'];
    product_id?: number;
    details?: Record<string, any>;
}
export interface AuditLogFilters {
    user_id?: number;
    product_id?: number;
    action?: AuditLog['action'];
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
export interface AuditLogListResponse {
    logs: AuditLog[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=audit.d.ts.map