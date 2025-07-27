import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
declare class ProductController {
    static getAllProducts(req: Request, res: Response): Promise<void>;
    static getProductById(req: Request, res: Response): Promise<void>;
    static createProduct(req: AuthenticatedRequest, res: Response): Promise<void>;
    static updateProduct(req: AuthenticatedRequest, res: Response): Promise<void>;
    static deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void>;
    static restoreProduct(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getDeletedProducts(req: AuthenticatedRequest, res: Response): Promise<void>;
    static searchProductsByName(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default ProductController;
//# sourceMappingURL=productController.d.ts.map