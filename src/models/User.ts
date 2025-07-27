import bcrypt from 'bcryptjs';
import database from '../utils/database';
import { User, UserWithoutPassword, LoginRequest, SignupRequest } from '../types/auth';

export class UserModel {
  static async create(userData: SignupRequest): Promise<UserWithoutPassword> {
    const { email, password, role = 'user' } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (email, password_hash, role)
      VALUES (?, ?, ?)
    `;

    const result = await database.insert(sql, [email, passwordHash, role]);
    const userId = result.insertId;

    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ? AND is_deleted = FALSE';
    const users = await database.query<User>(sql, [email]);
    return users.length > 0 ? users[0] : null;
  }

  static async findById(id: number): Promise<UserWithoutPassword | null> {
    const sql = 'SELECT id, email, role, created_at, updated_at FROM users WHERE id = ? AND is_deleted = FALSE';
    const users = await database.query<UserWithoutPassword>(sql, [id]);
    return users.length > 0 ? users[0] : null;
  }

  static async authenticate(loginData: LoginRequest): Promise<UserWithoutPassword> {
    const { email, password } = loginData;
    
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateLastLogin(id: number): Promise<void> {
    const sql = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [id]);
  }

  static async findAll(): Promise<UserWithoutPassword[]> {
    const sql = 'SELECT id, email, role, created_at, updated_at FROM users WHERE is_deleted = FALSE ORDER BY created_at DESC';
    return await database.query<UserWithoutPassword>(sql);
  }

  static async delete(id: number): Promise<void> {
    const sql = 'DELETE FROM users WHERE id = ?';
    await database.query(sql, [id]);
  }

  static async softDelete(id: number): Promise<void> {
    const sql = 'UPDATE users SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [id]);
  }

  static async updateRole(id: number, role: 'admin' | 'user'): Promise<UserWithoutPassword> {
    const sql = 'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [role, id]);
    
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Failed to update user role');
    }
    return updatedUser;
  }
}

export default UserModel; 