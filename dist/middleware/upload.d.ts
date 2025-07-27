import multer from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
declare const upload: multer.Multer;
export declare const uploadSingle: RequestHandler;
export declare const handleUploadError: (error: any, req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export default upload;
//# sourceMappingURL=upload.d.ts.map