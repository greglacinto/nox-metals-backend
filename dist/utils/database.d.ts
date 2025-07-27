import mysql from 'mysql2/promise';
declare class Database {
    private pool;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getPool(): mysql.Pool;
    query<T = any>(sql: string, params?: any[]): Promise<T[]>;
    insert(sql: string, params?: any[]): Promise<{
        insertId: number;
    }>;
    queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>;
    transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T>;
}
export declare const database: Database;
export default database;
//# sourceMappingURL=database.d.ts.map