import { Request, Response } from 'express';
import S3Service from '../services/s3Service';
import ProductModel from '../models/Product';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

class UploadController {
  /**
   * Upload image for a product
   */
  static async uploadProductImage(req: AuthenticatedRequest, res: Response) {
    try {
      // Check if file exists
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

      // Check if product exists
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // Upload file to S3
      const uploadResult = await S3Service.uploadFile(req.file, 'products');

      // Update product with new image URL
      const updatedProduct = await ProductModel.update(productId, {
        image_url: uploadResult.url,
      });

      if (!updatedProduct) {
        // If product update fails, delete the uploaded file
        await S3Service.deleteFile(uploadResult.key);
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
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload image',
      });
    }
  }

  /**
   * Upload image without associating with a product (for create product flow)
   */
  static async uploadImage(req: AuthenticatedRequest, res: Response) {
    try {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      // Upload file to S3
      const uploadResult = await S3Service.uploadFile(req.file, 'products');

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
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload image',
      });
    }
  }

  /**
   * Delete product image
   */
  static async deleteProductImage(req: AuthenticatedRequest, res: Response) {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID',
        });
      }

      // Check if product exists
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // If product has an image, delete it from S3
      if (product.image_url) {
        const key = S3Service.getKeyFromUrl(product.image_url);
        if (key) {
          try {
            await S3Service.deleteFile(key);
          } catch (error) {
            console.error('Failed to delete image from S3:', error);
            // Continue with product update even if S3 delete fails
          }
        }
      }

      // Update product to remove image URL
      const updatedProduct = await ProductModel.update(productId, {
        image_url: undefined,
      });

      return res.json({
        success: true,
        message: 'Product image deleted successfully',
        data: {
          product: updatedProduct,
        },
      });
    } catch (error: any) {
      console.error('Delete image error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete image',
      });
    }
  }
}

export default UploadController; 