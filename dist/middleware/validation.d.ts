import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const validateBody: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateParams: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: string;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
    limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: string | undefined;
    limit?: string | undefined;
}>;
export declare const searchSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}, {
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
//# sourceMappingURL=validation.d.ts.map