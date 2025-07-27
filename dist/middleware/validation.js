"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = exports.paginationSchema = exports.idParamSchema = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                res.status(400).json({
                    success: false,
                    message: `Validation failed: ${errorMessage}`,
                    errors: error.errors
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid request data'
                });
            }
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.query);
            req.query = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                res.status(400).json({
                    success: false,
                    message: `Query validation failed: ${errorMessage}`,
                    errors: error.errors
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid query parameters'
                });
            }
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.params);
            req.params = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
                res.status(400).json({
                    success: false,
                    message: `Parameter validation failed: ${errorMessage}`,
                    errors: error.errors
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid URL parameters'
                });
            }
        }
    };
};
exports.validateParams = validateParams;
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val) && val > 0, {
        message: 'ID must be a positive integer'
    })
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform((val) => val ? parseInt(val, 10) : 10)
});
exports.searchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional()
});
//# sourceMappingURL=validation.js.map