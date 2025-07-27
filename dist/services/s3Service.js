"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
});
const s3 = new aws_sdk_1.default.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
class S3Service {
    static async uploadFile(file, folder = 'products') {
        if (!BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET_NAME is not configured');
        }
        if (!this.isValidImageType(file.mimetype)) {
            throw new Error('Invalid file type. Only images are allowed.');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }
        const fileExtension = this.getFileExtension(file.originalname);
        const filename = `${(0, uuid_1.v4)()}.${fileExtension}`;
        const key = `${folder}/${filename}`;
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                originalName: file.originalname,
                uploadedAt: new Date().toISOString(),
            },
        };
        try {
            const result = await s3.upload(uploadParams).promise();
            return {
                url: result.Location,
                key: result.Key,
                filename: filename,
            };
        }
        catch (error) {
            console.error('S3 upload error:', error);
            throw new Error('Failed to upload file to S3');
        }
    }
    static async deleteFile(key) {
        if (!BUCKET_NAME) {
            throw new Error('AWS_S3_BUCKET_NAME is not configured');
        }
        const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: key,
        };
        try {
            await s3.deleteObject(deleteParams).promise();
        }
        catch (error) {
            console.error('S3 delete error:', error);
            throw new Error('Failed to delete file from S3');
        }
    }
    static getKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const keyParts = pathParts.slice(2);
            return keyParts.join('/');
        }
        catch (error) {
            return null;
        }
    }
    static isValidImageType(mimetype) {
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        return allowedTypes.includes(mimetype);
    }
    static getFileExtension(filename) {
        return filename.split('.').pop()?.toLowerCase() || 'jpg';
    }
}
exports.S3Service = S3Service;
exports.default = S3Service;
//# sourceMappingURL=s3Service.js.map