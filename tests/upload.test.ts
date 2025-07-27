/// <reference types="jest" />

import request from 'supertest';
import app from '../src/app';
import database from '../src/utils/database';

describe('Upload API', () => {
  let authToken: string;
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
    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

    authToken = signupResponse.status === 201 
      ? signupResponse.body.data.token
      : (await request(app).post('/api/auth/login').send({
          email: 'admin@test.com',
          password: 'password123'
        })).body.data.token;

    // Create test product
    const productResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Product',
        price: 99.99,
        description: 'Test product for upload testing'
      });

    testProductId = productResponse.body.data.product.id;
  });

  describe('POST /api/upload/image', () => {
    it('should upload an image successfully', async () => {
      const mockImage = Buffer.from('fake-image-data');
      
      const response = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', mockImage, 'test-image.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.image).toBeDefined();
      expect(response.body.data.image.url).toBeDefined();
    });

    it('should reject non-image files', async () => {
      const mockFile = Buffer.from('fake-text-data');
      
      const response = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', mockFile, 'test.txt');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject requests without authentication', async () => {
      const mockImage = Buffer.from('fake-image-data');
      
      const response = await request(app)
        .post('/api/upload/image')
        .attach('image', mockImage, 'test-image.jpg');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/upload/products/:id/image', () => {
    it('should upload product image successfully', async () => {
      const mockImage = Buffer.from('fake-image-data');
      
      const response = await request(app)
        .post(`/api/upload/products/${testProductId}/image`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('image', mockImage, 'product-image.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.product).toBeDefined();
      expect(response.body.data.image).toBeDefined();
    });
  });
}); 