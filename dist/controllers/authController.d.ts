import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
declare class AuthController {
    static signup(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static logout(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default AuthController;
//# sourceMappingURL=authController.d.ts.map