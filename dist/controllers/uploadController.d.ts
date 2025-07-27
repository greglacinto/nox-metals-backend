import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}
declare class UploadController {
    static uploadProductImage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static uploadImage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteProductImage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default UploadController;
//# sourceMappingURL=uploadController.d.ts.map