import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["admin", "user"]>>>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    role: "admin" | "user";
}, {
    password: string;
    email: string;
    role?: "admin" | "user" | undefined;
}>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodUnion<[z.ZodNumber, z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>]>;
    description: z.ZodOptional<z.ZodString>;
    image_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    description?: string | undefined;
    image_url?: string | undefined;
}, {
    name: string;
    price: string | number;
    description?: string | undefined;
    image_url?: string | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>]>>;
    description: z.ZodOptional<z.ZodString>;
    image_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    price?: number | undefined;
    description?: string | undefined;
    image_url?: string | undefined;
}, {
    name?: string | undefined;
    price?: string | number | undefined;
    description?: string | undefined;
    image_url?: string | undefined;
}>;
export declare const productFiltersSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["name", "price", "created_at"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    includeDeleted: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "created_at" | "name" | "price" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    includeDeleted?: boolean | undefined;
}, {
    search?: string | undefined;
    page?: string | undefined;
    limit?: string | undefined;
    sortBy?: "created_at" | "name" | "price" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    includeDeleted?: string | undefined;
}>;
export declare const auditLogFiltersSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    product_id: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    action: z.ZodOptional<z.ZodEnum<["CREATE", "UPDATE", "DELETE", "RESTORE", "LOGIN", "LOGOUT"]>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page?: number | undefined;
    limit?: number | undefined;
    user_id?: number | undefined;
    product_id?: number | undefined;
    action?: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN" | "LOGOUT" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    page?: string | undefined;
    limit?: string | undefined;
    user_id?: string | undefined;
    product_id?: string | undefined;
    action?: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN" | "LOGOUT" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const validateRequest: <T>(schema: z.ZodSchema<T>, data: unknown) => T;
export declare const safeValidate: <T>(schema: z.ZodSchema<T>, data: unknown) => T | null;
//# sourceMappingURL=validation.d.ts.map