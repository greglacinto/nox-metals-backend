import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3002'; // Use different port for tests

// Note: Jest functions are available in test files, not in setup
// Console mocking can be done in individual test files if needed 