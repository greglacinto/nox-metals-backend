import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  price: z.union([
    z.number().positive('Price must be positive'),
    z.string().transform((val) => parseFloat(val)).pipe(z.number().positive('Price must be positive'))
  ]),
  description: z.string().optional(),
  image_url: z.string().url('Invalid image URL').optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  price: z.union([
    z.number().positive('Price must be positive'),
    z.string().transform((val) => parseFloat(val)).pipe(z.number().positive('Price must be positive'))
  ]).optional(),
  description: z.string().optional(),
  image_url: z.string().url('Invalid image URL').optional(),
});

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'created_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().max(100)).optional(),
  includeDeleted: z.string().transform((val) => val === 'true').pipe(z.boolean()).optional(),
});

// Audit log schemas
export const auditLogFiltersSchema = z.object({
  user_id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
  product_id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN', 'LOGOUT']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().max(100)).optional(),
});

// Validation helper function
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    throw error;
  }
};

// Safe validation (returns null instead of throwing)
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    return null;
  }
}; 