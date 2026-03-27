"use server";

import { revalidatePath } from "next/cache";
import type { CartItem, CartItemWithDetails } from "@/types/cartItem";
import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch all cart items from the backend
 */
export async function getCartItems(): Promise<CartItem[]> {
    const result = await handleFetch(`${API_URL}/cart`, { cache: "no-store" });
    return result.success ? result.data : [];
}

/**
 * Fetch cart items with menu item details by user ID
 */
export async function getCartItemsWithDetails(userId: string): Promise<CartItemWithDetails[]> {
  void userId;
  const result = await handleFetch(`${API_URL}/cart`, { cache: "no-store" });
  return result.success ? result.data : [];
}

/**
 * Get cart item count for a user
 */
export async function getCartItemCount(userId: string): Promise<number> {
  void userId;
  const result = await handleFetch(`${API_URL}/cart`, { cache: "no-store" });
  if (!result.success || !Array.isArray(result.data)) return 0;
  return result.data.length;
}

export interface CartItemInput {
  userId: string;
  menuItemId: number;
  quantity: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: CartItem;
}

/**
 * Create a new cart item
 */
export async function createCartItem(input: CartItemInput): Promise<ActionResult> {
  const result = await handleFetch(`${API_URL}/cart`, {
    method: "POST",
    body: JSON.stringify({ menuItemId: input.menuItemId, quantity: input.quantity }),
  });

  if (result.success) {
    revalidatePath("/cart");
  }

  return {
    success: result.success,
    message: result.message || "Action processed",
    data: result.data,
  };
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(id: number, quantity: number): Promise<ActionResult> {
  const result = await handleFetch(`${API_URL}/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

  if (result.success) {
    revalidatePath("/cart");
  }

  return {
    success: result.success,
    message: result.message || "Action processed",
    data: result.data,
  };
}

/**
 * Clear all cart items for a user
 */
export async function clearCart(userId: string): Promise<ActionResult> {
  void userId;
  const result = await handleFetch(`${API_URL}/cart`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/cart");
  }

  return {
    success: result.success,
    message: result.message || "Cart cleared",
  };
}

/**
 * Delete a cart item
 */
export async function deleteCartItem(id: number): Promise<ActionResult> {
  const result = await handleFetch(`${API_URL}/cart/${id}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/cart");
  }

  return {
    success: result.success,
    message: result.message || "Item deleted",
  };
}
