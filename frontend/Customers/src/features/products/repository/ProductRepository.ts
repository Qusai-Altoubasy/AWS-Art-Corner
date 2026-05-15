import { CustomerProductResponse } from "../types/CustomerProductResponse";
import { api } from "../../../app/config/api-config";

class ProductsRepository {
  async getAllProducts(): Promise<CustomerProductResponse[]> {
    const response = await api.get("/api/inventory/products");
    return response.data;
  }
}

export const productsRepository = new ProductsRepository();
