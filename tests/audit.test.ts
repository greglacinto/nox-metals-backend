/// <reference types="jest" />

import request from 'supertest';
import app from '../src/app';
import database from '../src/utils/database';

describe('Audit API', () => {
  let adminToken: string;
  let userToken: string;
  let testProductId: number;

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

    userToken = userSignupResponse.status === 201
      ? userSignupResponse.body.data.token
      : (await request(app).post('/api/auth/login').send({
          email: 'user@test.com',
          password: 'password123'
        })).body.data.token;

    // Create test product to generate audit logs
    const productResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product for Audit',
        price: 99.99,
        description: 'Test product for audit logging'
      });

    testProductId = productResponse.body.data.product.id;
  });

  describe('GET /api/audit', () => {
    it('should get all audit logs with admin token', async () => {
      const response = await request(app)
        .get('/api/audit')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
      expect(Array.isArray(response.body.data.logs)).toBe(true);
    });

    it('should reject access without authentication', async () => {
      const response = await request(app)
        .get('/api/audit')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject access with user token (non-admin)', async () => {
      const response = await request(app)
        .get('/api/audit')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/audit/action/:action', () => {
    it('should get audit logs by action type with admin token', async () => {
      const response = await request(app)
        .get('/api/audit/action/CREATE')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs).toBeDefined();
      expect(Array.isArray(response.body.data.logs)).toBe(true);
    });

    it('should reject access without authentication', async () => {
      const response = await request(app)
        .get('/api/audit/action/CREATE')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Audit Log Data Integrity', () => {
    it('should verify audit log structure', async () => {
      const response = await request(app)
        .get('/api/audit')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.logs.length).toBeGreaterThan(0);
      
      // Check audit log structure
      const log = response.body.data.logs[0];
      expect(log.id).toBeDefined();
      expect(log.action).toBeDefined();
      expect(log.user_email).toBeDefined();
      expect(log.timestamp).toBeDefined();
    });
  });
}); 