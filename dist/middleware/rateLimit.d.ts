import { Request, Response, NextFunction } from 'express';
export declare const createRateLimitErrorHandler: (endpoint: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const createRateLimit: (options: {
    windowMs: number;
    max: number;
    message: string;
    endpoint?: string;
}) => import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.d.ts.map