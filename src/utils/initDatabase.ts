import database from './database';

const createTables = async (): Promise<void> => {
  try {
    console.log('🔄 Creating database tables...');

    // Create users table
    await database.query(`
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

    // Create products table
    await database.query(`
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

    // Create audit_logs table
    await database.query(`
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

    // Create indexes for better performance
    await database.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_products_is_deleted ON products(is_deleted)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_product_id ON audit_logs(product_id)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)');
    await database.query('CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)');

    console.log('✅ Database indexes created');
    console.log('🎉 Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const createDefaultAdmin = async (): Promise<void> => {
  try {
    console.log('🔄 Creating default admin user...');

    // Check if admin already exists
    const existingAdmin = await database.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@noxmetals.com']
    );

    if (existingAdmin.length === 0) {
      // Create default admin user
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('admin123', 12);

      await database.insert(`
        INSERT INTO users (email, password_hash, role)
        VALUES (?, ?, 'admin')
      `, ['admin@noxmetals.com', passwordHash]);

      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@noxmetals.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️  Default admin user already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create default admin:', error);
  }
};

const initDatabase = async (): Promise<void> => {
  try {
    await createTables();
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase();
}

export { initDatabase, createTables, createDefaultAdmin }; 