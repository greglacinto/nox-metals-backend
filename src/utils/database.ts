import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  async connect(): Promise<void> {
    try {
      await this.pool.getConnection();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
  }

  getPool(): mysql.Pool {
    return this.pool;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  async insert(sql: string, params?: any[]): Promise<{ insertId: number }> {
    try {
      const [result] = await this.pool.query(sql, params);
      return result as { insertId: number };
    } catch (error) {
      console.error('❌ Database insert failed:', error);
      throw error;
    }
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
      const [rows] = await this.pool.query(sql, params);
      const results = rows as T[];
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export const database = new Database();
export default database; 