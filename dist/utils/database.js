"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'nox_metals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
class Database {
    constructor() {
        this.pool = promise_1.default.createPool(dbConfig);
    }
    async connect() {
        try {
            await this.pool.getConnection();
            console.log('✅ Database connected successfully');
        }
        catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }
    async disconnect() {
        try {
            await this.pool.end();
            console.log('✅ Database disconnected successfully');
        }
        catch (error) {
            console.error('❌ Database disconnection failed:', error);
            throw error;
        }
    }
    getPool() {
        return this.pool;
    }
    async query(sql, params) {
        try {
            const [rows] = await this.pool.query(sql, params);
            return rows;
        }
        catch (error) {
            console.error('❌ Database query failed:', error);
            throw error;
        }
    }
    async insert(sql, params) {
        try {
            const [result] = await this.pool.query(sql, params);
            return result;
        }
        catch (error) {
            console.error('❌ Database insert failed:', error);
            throw error;
        }
    }
    async queryOne(sql, params) {
        try {
            const [rows] = await this.pool.query(sql, params);
            const results = rows;
            return results.length > 0 ? results[0] : null;
        }
        catch (error) {
            console.error('❌ Database query failed:', error);
            throw error;
        }
    }
    async transaction(callback) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
}
exports.database = new Database();
exports.default = exports.database;
//# sourceMappingURL=database.js.map