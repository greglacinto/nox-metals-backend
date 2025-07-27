/// <reference types="jest" />

import request from 'supertest';
import app from '../src/app';
import database from '../src/utils/database';

describe('Users API', () => {
  let adminToken: string;
  let userToken: string;
  let testUserId: number;

  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await database.query('DELETE FROM audit_logs WHERE user_email LIKE "%test.com"');
    await database.query('DELETE FROM products WHERE name LIKE "%Test Product%"');
    await database.query('DELETE FROM users WHERE email LIKE "%test.com"');

    // Create test admin user
    const adminSignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

    adminToken = adminSignupResponse.status === 201 
      ? adminSignupResponse.body.data.token
      : (await request(app).post('/api/auth/login').send({
          email: 'admin@test.com',
          password: 'password123'
        })).body.data.token;

    // Create test regular user
    const userSignupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'user@test.com',
        password: 'password123',
        role: 'user'
      });

    if (userSignupResponse.status === 201) {
      userToken = userSignupResponse.body.data.token;
      testUserId = userSignupResponse.body.data.user.id;
    } else {
      const userLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'password123'
        });
      
      userToken = userLoginResponse.body.data.token;
      testUserId = userLoginResponse.body.data.user.id;
    }
  });

  describe('GET /api/users', () => {
    it('should get all users with admin token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    it('should reject access without authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject access with user token (non-admin)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID with admin token', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(testUserId);
      expect(response.body.data.user.email).toBe('user@test.com');
    });

    it('should reject access without authentication', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/users/:id/role', () => {
    it('should update user role successfully with admin token', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'admin' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUserId}/role`)
        .send({ role: 'admin' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should soft delete user successfully with admin token', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.is_deleted).toBe(true);
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 