import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ProductFilters } from '../types/product';
import ProductModel from '../models/Product';
import AuditLogModel from '../models/AuditLog';

class ProductController {
  static async getAllProducts(req: Request, res: Response): Promise<void> {
 
    try {
      const filters: ProductFilters = {
        search: req.query.search as string,
        sortBy: req.query.sortBy as 'name' | 'price' | 'created_at',
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        includeDeleted: req.query.includeDeleted ? true : false
      };

      const result = await ProductModel.findAll(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products'
      });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(parseInt(id));

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { product }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product'
      });
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const productData = req.body;
      const product = await ProductModel.create(productData, req.user.id);

      // Log the creation
      await AuditLogModel.create({
        user_id: req.user.id,
        user_email: req.user.email,
        action: 'CREATE',
        product_id: product.id,
        details: { product_name: product.name, price: product.price }
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create product'
        });
      }
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const productId = parseInt(id);
      const updateData = req.body;

      // Check if product exists
      const existingProduct = await ProductModel.findById(productId);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      const product = await ProductModel.update(productId, updateData);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      // Log the update
      await AuditLogModel.create({
        user_id: req.user.id,
        user_email: req.user.email,
        action: 'UPDATE',
        product_id: product.id,
        details: { 
          product_name: product.name,
          updated_fields: Object.keys(updateData)
        }
      });

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update product'
        });
      }
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const productId = parseInt(id);

      // Check if product exists
      const existingProduct = await ProductModel.findById(productId);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      await ProductModel.softDelete(productId);

      // Log the deletion
      await AuditLogModel.create({
        user_id: req.user.id,
        user_email: req.user.email,
        action: 'DELETE',
        product_id: productId,
        details: { product_name: existingProduct.name }
      });

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }
  }

  static async restoreProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { id } = req.params;
      const productId = parseInt(id);

      await ProductModel.restore(productId);

      // Log the restoration
      await AuditLogModel.create({
        user_id: req.user.id,
        user_email: req.user.email,
        action: 'RESTORE',
        product_id: productId,
        details: { action: 'restore' }
      });

      res.json({
        success: true,
        message: 'Product restored successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to restore product'
      });
    }
  }

  static async getDeletedProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const products = await ProductModel.getDeletedProducts();

      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch deleted products'
      });
    }
  }

  static async searchProductsByName(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const products = await ProductModel.searchByName(name);

      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search products'
      });
    }
  }
}

export default ProductController; 