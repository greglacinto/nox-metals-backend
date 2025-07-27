"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultAdmin = exports.createTables = exports.initDatabase = void 0;
const database_1 = __importDefault(require("./database"));
const createTables = async () => {
    try {
        console.log('🔄 Creating database tables...');
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Users table created');
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        is_deleted BOOLEAN DEFAULT FALSE,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);
        console.log('✅ Products table created');
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        user_email VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL,
        product_id INT,
        details JSON,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
        console.log('✅ Audit logs table created');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_products_is_deleted ON products(is_deleted)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_product_id ON audit_logs(product_id)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)');
        await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)');
        console.log('✅ Database indexes created');
        console.log('🎉 Database initialization completed successfully!');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
exports.createTables = createTables;
const createDefaultAdmin = async () => {
    try {
        console.log('🔄 Creating default admin user...');
        const existingAdmin = await database_1.default.query('SELECT id FROM users WHERE email = ?', ['admin@noxmetals.com']);
        if (existingAdmin.length === 0) {
            const bcrypt = require('bcryptjs');
            const passwordHash = await bcrypt.hash('admin123', 12);
            await database_1.default.insert(`
        INSERT INTO users (email, password_hash, role)
        VALUES (?, ?, 'admin')
      `, ['admin@noxmetals.com', passwordHash]);
            console.log('✅ Default admin user created');
            console.log('📧 Email: admin@noxmetals.com');
            console.log('🔑 Password: admin123');
        }
        else {
            console.log('ℹ️  Default admin user already exists');
        }
    }
    catch (error) {
        console.error('❌ Failed to create default admin:', error);
    }
};
exports.createDefaultAdmin = createDefaultAdmin;
const initDatabase = async () => {
    try {
        await createTables();
        await createDefaultAdmin();
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};
exports.initDatabase = initDatabase;
if (require.main === module) {
    initDatabase();
}
//# sourceMappingURL=initDatabase.js.map