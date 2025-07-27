export interface UploadResult {
    url: string;
    key: string;
    filename: string;
}
export declare class S3Service {
    static uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
    static deleteFile(key: string): Promise<void>;
    static getKeyFromUrl(url: string): string | null;
    private static isValidImageType;
    private static getFileExtension;
}
export default S3Service;
//# sourceMappingURL=s3Service.d.ts.map