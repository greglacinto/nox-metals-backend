import { Product, CreateProductRequest, UpdateProductRequest, ProductFilters, ProductListResponse } from '../types/product';
export declare class ProductModel {
    static create(productData: CreateProductRequest, createdBy: number): Promise<Product>;
    static findById(id: number): Promise<Product | null>;
    static findAll(filters?: ProductFilters): Promise<ProductListResponse>;
    static update(id: number, productData: UpdateProductRequest): Promise<Product | null>;
    static softDelete(id: number): Promise<void>;
    static restore(id: number): Promise<void>;
    static hardDelete(id: number): Promise<void>;
    static getDeletedProducts(): Promise<Product[]>;
    static searchByName(name: string): Promise<Product[]>;
    static getProductsByCreator(creatorId: number): Promise<Product[]>;
}
export default ProductModel;
//# sourceMappingURL=Product.d.ts.map