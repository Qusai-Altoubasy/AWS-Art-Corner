import { AdminProductResponse } from "../types/AdminProductResponse";
import { api } from "../../../app/config/api-config";
import { ProductRequest } from "../types/ProductRequest";
import { PresignedUrlResponse } from "../types/PresignedUrlResponse";

class ProductsRepository {
  async getAllProducts(): Promise<AdminProductResponse[]> {
    const response = await api.get("/api/inventory");
    return response.data;
  }

  async updateProduct(
    id: number,
    productData: ProductRequest,
  ): Promise<AdminProductResponse> {
    const response = await api.patch(`/api/inventory/${id}`, productData);
    return response.data;
  }

  async getPresignedUrl(
    main: string,
    sub: string,
  ): Promise<PresignedUrlResponse> {
    const response = await api.get(
      `/api/inventory/products/presigned-url/${main}/${sub}`,
    );
    return response.data;
  }

  async createProduct(
    productData: ProductRequest,
  ): Promise<AdminProductResponse> {
    const response = await api.post("/api/inventory", productData);
    return response.data;
  }

  async deleteProduct(id: number) {
    await api.delete(`/api/inventory/${id}`);
  }
}

export const productsRepository = new ProductsRepository();
