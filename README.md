# Nox Metals Backend API

A robust Node.js/Express API for the Nox Metals product management system with authentication, authorization, audit logging, and comprehensive product management features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations with search, filtering, and pagination
- **Audit Logging**: Comprehensive audit trail for all product operations
- **Image Upload**: AWS S3 integration for product images
- **Security**: Rate limiting, input validation, and security headers
- **Testing**: Comprehensive test suite with Jest
- **Database**: MySQL with connection pooling and optimized queries

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MySQL 8.0+
- **Authentication**: JWT tokens
- **File Storage**: AWS S3
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MySQL 8.0+ database
- AWS S3 bucket (for image uploads)
- AWS credentials (for S3 access)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=nox_metals

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# AWS Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=nox-metals-products

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

Initialize the database tables and create default admin user:

```bash
pnpm run db:init
```

This will:
- Create all necessary tables
- Set up database indexes
- Create a default admin user (admin@noxmetals.com / admin123)

### 4. Start Development Server

```bash
pnpm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Product Endpoints

#### GET /api/products
Get all products with filtering and pagination.

**Query Parameters:**
- `search`: Search in product name and description
- `sortBy`: Sort field (name, price, created_at)
- `sortOrder`: Sort direction (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `includeDeleted`: Include soft-deleted products (true/false)

**Example:**
```
GET /api/products?search=aluminum&sortBy=price&sortOrder=desc&page=1&limit=20
```

#### POST /api/products
Create a new product (Admin only).

**Request Body:**
```json
{
  "name": "Aluminum Sheet",
  "price": 25.99,
  "description": "High-quality aluminum sheet",
  "image_url": "https://example.com/image.jpg"
}
```

#### PUT /api/products/:id
Update a product (Admin only).

#### DELETE /api/products/:id
Soft delete a product (Admin only).

#### PATCH /api/products/:id/restore
Restore a soft-deleted product (Admin only).

### Audit Log Endpoints

#### GET /api/audit/logs
Get audit logs with filtering (Admin only).

**Query Parameters:**
- `user_id`: Filter by user ID
- `product_id`: Filter by product ID
- `action`: Filter by action type
- `startDate`: Start date for range
- `endDate`: End date for range
- `page`: Page number
- `limit`: Items per page

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

- `tests/auth.test.ts` - Authentication tests
- `tests/products.test.ts` - Product management tests
- `tests/audit.test.ts` - Audit logging tests

## 🏗️ Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── productController.ts
│   └── auditController.ts
├── middleware/           # Express middleware
│   ├── auth.ts
│   ├── roleCheck.ts
│   └── validation.ts
├── models/              # Database models
│   ├── User.ts
│   ├── Product.ts
│   └── AuditLog.ts
├── routes/              # API routes
│   ├── auth.ts
│   ├── products.ts
│   └── audit.ts
├── types/               # TypeScript type definitions
│   ├── auth.ts
│   ├── product.ts
│   └── audit.ts
├── utils/               # Utility functions
│   ├── database.ts
│   ├── jwt.ts
│   ├── validation.ts
│   └── initDatabase.ts
└── app.ts              # Main application file
```

## 🔧 Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm db:init` - Initialize database tables and default admin

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and user roles
- **Input Validation**: Zod schema validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS settings
- **SQL Injection Prevention**: Parameterized queries
- **Password Hashing**: bcrypt for secure password storage

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
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
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_email VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  product_id INT,
  details JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Variables for Production

Make sure to set these environment variables in production:

- `NODE_ENV=production`
- `JWT_SECRET` - Use a strong, unique secret
- `DATABASE_URL` - Production database connection string
- `AWS_*` - Production AWS credentials
- `CORS_ORIGIN` - Your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. 