"use server";

import { revalidatePath } from "next/cache";
import type { CartItem, CartItemWithDetails } from "@/types/cartItem";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// READ Operations
// ============================================

/**
 * Fetch all cart items from the backend
 */
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const response = await fetch(`${API_URL}/cart`, { cache: "no-store" });
    const result = await response.json();
    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}

/**
 * Fetch cart items by user ID
 */
export async function getCartItemsByUserId(userId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`${API_URL}/cart/user/${userId}`, { cache: "no-store" });
    const result = await response.json();
    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Error fetching cart items by user ID:", error);
    return [];
  }
}

/**
 * Fetch cart items with menu item details by user ID
 */
export async function getCartItemsWithDetails(userId: string): Promise<CartItemWithDetails[]> {
  try {
    const response = await fetch(`${API_URL}/cart/user/${userId}?includeDetails=true`, { cache: "no-store" });
    const result = await response.json();
    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Error fetching cart items with details:", error);
    return [];
  }
}

/**
 * Get cart item count for a user
 */
export async function getCartItemCount(userId: string): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/cart/count/${userId}`, { cache: "no-store" });
    const result = await response.json();
    if (!result.success) return 0;
    return result.data;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return 0;
  }
}

/**
 * Fetch a single cart item by ID
 */
export async function getCartItemById(id: number): Promise<CartItem | null> {
  try {
    const response = await fetch(`${API_URL}/cart/${id}`, { cache: "no-store" });
    const result = await response.json();
    if (!result.success) return null;
    return result.data;
  } catch (error) {
    console.error("Error fetching cart item by id:", error);
    return null;
  }
}

// ============================================
// CREATE/UPDATE/DELETE Operations
// ============================================

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
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await response.json();

    if (result.success) {
      revalidatePath("/cart");
    }

    return {
      success: result.success,
      message: result.message || "Action processed",
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating cart item:", error);
    return {
      success: false,
      message: "Failed to create cart item.",
    };
  }
}

/**
 * Update an existing cart item
 */
export async function updateCartItem(id: number, input: CartItemInput): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await response.json();

    if (result.success) {
      revalidatePath("/cart");
    }

    return {
      success: result.success,
      message: result.message || "Action processed",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      success: false,
      message: "Failed to update cart item.",
    };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(id: number, quantity: number): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/cart/${id}/quantity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const result = await response.json();

    if (result.success) {
      revalidatePath("/cart");
    }

    return {
      success: result.success,
      message: result.message || "Action processed",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating quantity:", error);
    return {
      success: false,
      message: "Failed to update quantity.",
    };
  }
}

/**
 * Clear all cart items for a user
 */
export async function clearCart(userId: string): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/cart/user/${userId}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.success) {
      revalidatePath("/cart");
    }

    return {
      success: result.success,
      message: result.message || "Cart cleared",
    };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      message: "Failed to clear cart.",
    };
  }
}

/**
 * Delete a cart item
 */
export async function deleteCartItem(id: number): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.success) {
      revalidatePath("/cart");
    }

    return {
      success: result.success,
      message: result.message || "Item deleted",
    };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return {
      success: false,
      message: "Failed to delete item.",
    };
  }
}
