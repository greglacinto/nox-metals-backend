import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare const requireRole: (requiredRole: "admin" | "user") => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const optionalRole: (requiredRole: "admin" | "user") => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleCheck.d.ts.map