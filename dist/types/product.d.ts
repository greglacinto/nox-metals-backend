export interface Product {
    id: number;
    name: string;
    price: number;
    description: string | null;
    image_url: string | null;
    is_deleted: boolean;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}
export interface CreateProductRequest {
    name: string;
    price: number;
    description?: string;
    image_url?: string;
}
export interface UpdateProductRequest {
    name?: string;
    price?: number;
    description?: string;
    image_url?: string;
}
export interface ProductFilters {
    search?: string;
    sortBy?: 'name' | 'price' | 'created_at';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    includeDeleted?: boolean;
}
export interface ProductListResponse {
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=product.d.ts.map