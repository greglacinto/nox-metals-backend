"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const database_1 = __importDefault(require("../utils/database"));
class ProductModel {
    static async create(productData, createdBy) {
        const { name, price, description, image_url } = productData;
        const sql = `
      INSERT INTO products (name, price, description, image_url, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
        const result = await database_1.default.insert(sql, [name, price, description, image_url, createdBy]);
        const productId = result.insertId;
        const product = await this.findById(productId);
        if (!product) {
            throw new Error('Failed to create product');
        }
        return product;
    }
    static async findById(id) {
        const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.id = ?
    `;
        const products = await database_1.default.query(sql, [id]);
        return products.length > 0 ? products[0] : null;
    }
    static async findAll(filters = {}) {
        const { search = '', sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10, includeDeleted = false } = filters;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const params = [];
        if (search) {
            whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (!includeDeleted) {
            whereClause += ' AND p.is_deleted = FALSE';
        }
        const orderBy = `ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;
        const countSql = `
      SELECT COUNT(*) as total 
      FROM products p 
      ${whereClause}
    `;
        const countResult = await database_1.default.query(countSql, params);
        const total = countResult[0].total;
        const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;
        const products = await database_1.default.query(sql, [...params, Number(limit), Number(offset)]);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async update(id, productData) {
        const { name, price, description, image_url } = productData;
        const updateFields = [];
        const params = [];
        if (name !== undefined) {
            updateFields.push('name = ?');
            params.push(name);
        }
        if (price !== undefined) {
            updateFields.push('price = ?');
            params.push(price);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            params.push(description);
        }
        if (image_url !== undefined) {
            updateFields.push('image_url = ?');
            params.push(image_url);
        }
        if (updateFields.length === 0) {
            return this.findById(id);
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);
        const sql = `
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
        await database_1.default.query(sql, params);
        return this.findById(id);
    }
    static async softDelete(id) {
        const sql = 'UPDATE products SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await database_1.default.query(sql, [id]);
    }
    static async restore(id) {
        const sql = 'UPDATE products SET is_deleted = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await database_1.default.query(sql, [id]);
    }
    static async hardDelete(id) {
        const sql = 'DELETE FROM products WHERE id = ?';
        await database_1.default.query(sql, [id]);
    }
    static async getDeletedProducts() {
        const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.is_deleted = TRUE 
      ORDER BY p.updated_at DESC
    `;
        return await database_1.default.query(sql);
    }
    static async searchByName(name) {
        const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.name LIKE ? AND p.is_deleted = FALSE 
      ORDER BY p.name ASC
    `;
        return await database_1.default.query(sql, [`%${name}%`]);
    }
    static async getProductsByCreator(creatorId) {
        const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.created_by = ? AND p.is_deleted = FALSE 
      ORDER BY p.created_at DESC
    `;
        return await database_1.default.query(sql, [creatorId]);
    }
}
exports.ProductModel = ProductModel;
exports.default = ProductModel;
//# sourceMappingURL=Product.js.map