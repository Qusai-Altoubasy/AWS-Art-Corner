import { CartItemResponse } from "../types/CartItemResponse";
import { CartItemRequest } from "../types/CartItemRequest";
import { api } from "../../../app/config/api-config";

class CartRepository {
  async getCartItems(): Promise<CartItemResponse[]> {
    const response = await api.get("/api/cart/items");
    return response.data;
  }

  async addToCart(item: CartItemRequest): Promise<string> {
    const response = await api.post("/api/cart/item", item);
    return response.data;
  }

  async removeFromCart(productId: number) {
    await api.delete(`/api/cart/item/${productId.toString()}`);
  }
}

export const cartRepository = new CartRepository();
