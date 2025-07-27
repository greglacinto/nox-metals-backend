"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3Service_1 = __importDefault(require("../services/s3Service"));
const Product_1 = __importDefault(require("../models/Product"));
class UploadController {
    static async uploadProductImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                });
            }
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID',
                });
            }
            const product = await Product_1.default.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
            const uploadResult = await s3Service_1.default.uploadFile(req.file, 'products');
            const updatedProduct = await Product_1.default.update(productId, {
                image_url: uploadResult.url,
            });
            if (!updatedProduct) {
                await s3Service_1.default.deleteFile(uploadResult.key);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update product with image',
                });
            }
            return res.json({
                success: true,
                message: 'Product image uploaded successfully',
                data: {
                    product: updatedProduct,
                    image: {
                        url: uploadResult.url,
                        key: uploadResult.key,
                        filename: uploadResult.filename,
                    },
                },
            });
        }
        catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to upload image',
            });
        }
    }
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                });
            }
            const uploadResult = await s3Service_1.default.uploadFile(req.file, 'products');
            return res.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    image: {
                        url: uploadResult.url,
                        key: uploadResult.key,
                        filename: uploadResult.filename,
                    },
                },
            });
        }
        catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to upload image',
            });
        }
    }
    static async deleteProductImage(req, res) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID',
                });
            }
            const product = await Product_1.default.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
            if (product.image_url) {
                const key = s3Service_1.default.getKeyFromUrl(product.image_url);
                if (key) {
                    try {
                        await s3Service_1.default.deleteFile(key);
                    }
                    catch (error) {
                        console.error('Failed to delete image from S3:', error);
                    }
                }
            }
            const updatedProduct = await Product_1.default.update(productId, {
                image_url: undefined,
            });
            return res.json({
                success: true,
                message: 'Product image deleted successfully',
                data: {
                    product: updatedProduct,
                },
            });
        }
        catch (error) {
            console.error('Delete image error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete image',
            });
        }
    }
}
exports.default = UploadController;
//# sourceMappingURL=uploadController.js.map