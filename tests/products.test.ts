/// <reference types="jest" />

import request from 'supertest';
import app from '../src/app';
import database from '../src/utils/database';

describe('Products API', () => {
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
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      const product = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          price: 99.99,
          description: 'Test product'
        });

      testProductId = product.body.data.product.id;
    });

    it('should get all products without authentication', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeDefined();
      expect(Array.isArray(response.body.data.products)).toBe(true);
    });

    it('should get products with pagination', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });
  });

  describe('POST /api/products', () => {
    it('should create product successfully with admin token', async () => {
      const productData = {
        name: 'New Test Product',
        price: 199.99,
        description: 'A new test product'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.name).toBe(productData.name);
      expect(response.body.data.product.price).toBe(productData.price.toString());
    });

    it('should reject product creation without authentication', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Unauthorized Product',
          price: 99.99,
          description: 'This should fail'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject product creation with user token (non-admin)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'User Product',
          price: 99.99,
          description: 'This should fail for non-admin'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id', () => {
    beforeEach(async () => {
      const product = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Original Product',
          price: 99.99,
          description: 'Original description'
        });

      testProductId = product.body.data.product.id;
    });

    it('should update product successfully with admin token', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 149.99,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.name).toBe(updateData.name);
      expect(response.body.data.product.price).toBe(updateData.price.toString());
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/products/${testProductId}`)
        .send({
          name: 'Unauthorized Update',
          price: 199.99,
          description: 'This should fail'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/products/:id', () => {
    beforeEach(async () => {
      const product = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Product to Delete',
          price: 99.99,
          description: 'This product will be deleted'
        });

      testProductId = product.body.data.product.id;
    });

    it('should soft delete product successfully with admin token', async () => {
      const response = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.is_deleted).toBe(true);
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app)
        .delete(`/api/products/${testProductId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/products/:id/restore', () => {
    beforeEach(async () => {
      const product = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Product to Restore',
          price: 99.99,
          description: 'This product will be restored'
        });

      testProductId = product.body.data.product.id;

      // Delete the product first
      await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    });

    it('should restore deleted product successfully with admin token', async () => {
      const response = await request(app)
        .patch(`/api/products/${testProductId}/restore`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.is_deleted).toBe(false);
    });
  });
}); 