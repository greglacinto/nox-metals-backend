"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../models/Product"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
class ProductController {
    static async getAllProducts(req, res) {
        try {
            const filters = {
                search: req.query.search,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                includeDeleted: req.query.includeDeleted ? true : false
            };
            const result = await Product_1.default.findAll(filters);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.log("error", error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products'
            });
        }
    }
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product_1.default.findById(parseInt(id));
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch product'
            });
        }
    }
    static async createProduct(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const productData = req.body;
            const product = await Product_1.default.create(productData, req.user.id);
            await AuditLog_1.default.create({
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
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create product'
                });
            }
        }
    }
    static async updateProduct(req, res) {
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
            const existingProduct = await Product_1.default.findById(productId);
            if (!existingProduct) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
                return;
            }
            const product = await Product_1.default.update(productId, updateData);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
                return;
            }
            await AuditLog_1.default.create({
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
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update product'
                });
            }
        }
    }
    static async deleteProduct(req, res) {
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
            const existingProduct = await Product_1.default.findById(productId);
            if (!existingProduct) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
                return;
            }
            await Product_1.default.softDelete(productId);
            await AuditLog_1.default.create({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete product'
            });
        }
    }
    static async restoreProduct(req, res) {
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
            await Product_1.default.restore(productId);
            await AuditLog_1.default.create({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to restore product'
            });
        }
    }
    static async getDeletedProducts(req, res) {
        try {
            const products = await Product_1.default.getDeletedProducts();
            res.json({
                success: true,
                data: { products }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch deleted products'
            });
        }
    }
    static async searchProductsByName(req, res) {
        try {
            const { name } = req.params;
            const products = await Product_1.default.searchByName(name);
            res.json({
                success: true,
                data: { products }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to search products'
            });
        }
    }
}
exports.default = ProductController;
//# sourceMappingURL=productController.js.map