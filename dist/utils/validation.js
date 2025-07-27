"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeValidate = exports.validateRequest = exports.auditLogFiltersSchema = exports.productFiltersSchema = exports.updateProductSchema = exports.createProductSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['admin', 'user']).optional().default('user'),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name too long'),
    price: zod_1.z.union([
        zod_1.z.number().positive('Price must be positive'),
        zod_1.z.string().transform((val) => parseFloat(val)).pipe(zod_1.z.number().positive('Price must be positive'))
    ]),
    description: zod_1.z.string().optional(),
    image_url: zod_1.z.string().url('Invalid image URL').optional(),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
    price: zod_1.z.union([
        zod_1.z.number().positive('Price must be positive'),
        zod_1.z.string().transform((val) => parseFloat(val)).pipe(zod_1.z.number().positive('Price must be positive'))
    ]).optional(),
    description: zod_1.z.string().optional(),
    image_url: zod_1.z.string().url('Invalid image URL').optional(),
});
exports.productFiltersSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['name', 'price', 'created_at']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    page: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive()).optional(),
    limit: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive().max(100)).optional(),
    includeDeleted: zod_1.z.string().transform((val) => val === 'true').pipe(zod_1.z.boolean()).optional(),
});
exports.auditLogFiltersSchema = zod_1.z.object({
    user_id: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive()).optional(),
    product_id: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive()).optional(),
    action: zod_1.z.enum(['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN', 'LOGOUT']).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    page: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive()).optional(),
    limit: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive().max(100)).optional(),
});
const validateRequest = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
            throw new Error(`Validation failed: ${errorMessage}`);
        }
        throw error;
    }
};
exports.validateRequest = validateRequest;
const safeValidate = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        return null;
    }
};
exports.safeValidate = safeValidate;
//# sourceMappingURL=validation.js.map