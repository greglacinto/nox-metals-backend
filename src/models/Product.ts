import database from '../utils/database';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductFilters, 
  ProductListResponse 
} from '../types/product';

export class ProductModel {
  static async create(productData: CreateProductRequest, createdBy: number): Promise<Product> {
    const { name, price, description, image_url } = productData;

    const sql = `
      INSERT INTO products (name, price, description, image_url, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await database.insert(sql, [name, price, description, image_url, createdBy]);
    const productId = result.insertId;

    const product = await this.findById(productId);
    if (!product) {
      throw new Error('Failed to create product');
    }
    return product;
  }

  static async findById(id: number): Promise<Product | null> {
    const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.id = ?
    `;
    const products = await database.query<Product>(sql, [id]);
    return products.length > 0 ? products[0] : null;
  }

  static async findAll(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const {
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      includeDeleted = false 
    } = filters;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (!includeDeleted) {
      whereClause += ' AND p.is_deleted = FALSE';
    }

    // Build ORDER BY clause
    const orderBy = `ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM products p 
      ${whereClause}
    `;
    const countResult = await database.query(countSql, params);
    const total = (countResult as any)[0].total;

    // Get products
    const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const products = await database.query<Product>(sql, [...params, Number(limit), Number(offset)]);

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

  static async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    const { name, price, description, image_url } = productData;

    const updateFields: string[] = [];
    const params: any[] = [];

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

    await database.query(sql, params);
    return this.findById(id);
  }

  static async softDelete(id: number): Promise<void> {
    const sql = 'UPDATE products SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [id]);
  }

  static async restore(id: number): Promise<void> {
    const sql = 'UPDATE products SET is_deleted = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [id]);
  }

  static async hardDelete(id: number): Promise<void> {
    const sql = 'DELETE FROM products WHERE id = ?';
    await database.query(sql, [id]);
  }

  static async getDeletedProducts(): Promise<Product[]> {
    const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.is_deleted = TRUE 
      ORDER BY p.updated_at DESC
    `;
    return await database.query<Product>(sql);
  }

  static async searchByName(name: string): Promise<Product[]> {
    const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.name LIKE ? AND p.is_deleted = FALSE 
      ORDER BY p.name ASC
    `;
    return await database.query<Product>(sql, [`%${name}%`]);
  }

  static async getProductsByCreator(creatorId: number): Promise<Product[]> {
    const sql = `
      SELECT p.*, u.email as creator_email 
      FROM products p 
      LEFT JOIN users u ON p.created_by = u.id 
      WHERE p.created_by = ? AND p.is_deleted = FALSE 
      ORDER BY p.created_at DESC
    `;
    return await database.query<Product>(sql, [creatorId]);
  }
}

export default ProductModel; 