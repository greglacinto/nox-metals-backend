import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}
declare class UserController {
    static getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateUserRole(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteUser(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default UserController;
//# sourceMappingURL=userController.d.ts.map