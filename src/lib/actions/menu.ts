"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { MenuItem } from "@/types/menuItems";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE_NAME = "better-auth.session_token";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token
    ? { Cookie: `${SESSION_COOKIE_NAME}=${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// ============================================
// READ Operations
// ============================================

/**
 * Fetch all menu items from the backend
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      cache: "no-store",
      headers: await getAuthHeaders(),
    });
    const result = await response.json();

    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

/**
 * Fetch menu items filtered by category
 */
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${API_URL}/menu?category=${category}`, {
      cache: "no-store",
      headers: await getAuthHeaders(),
    });
    const result = await response.json();

    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    return [];
  }
}

/**
 * Fetch a single menu item by ID
 */
export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  try {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      cache: "no-store",
      headers: await getAuthHeaders(),
    });
    const result = await response.json();

    if (!result.success) return null;
    return result.data;
  } catch (error) {
    console.error("Error fetching menu item by id:", error);
    return null;
  }
}

/**
 * Get all unique categories from menu items
 */
export async function getMenuCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/menu/categories`, {
      cache: "no-store",
      headers: await getAuthHeaders(),
    });
    const result = await response.json();

    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ============================================
// CREATE/UPDATE/DELETE Operations
// ============================================

export interface MenuItemInput {
  name: string;
  content: string;
  category: string;
  price: number;
  image: string;
  discount?: string;
  freeDelivery: boolean;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: MenuItem;
}

/**
 * Create a new menu item
 */
export async function createMenuItem(input: MenuItemInput): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath("/menu");
      revalidatePath("/admin/items");
    }

    return {
      success: result.success,
      message: result.message || "Action processed",
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return {
      success: false,
      message: "Failed to create menu item. Please try again.",
    };
  }
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(id: number, input: MenuItemInput): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath("/menu");
      revalidatePath("/admin/items");
      revalidatePath(`/admin/items/update-item/${id}`);
    }

    return {
      success: result.success,
      message: result.message || "Action processed",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return {
      success: false,
      message: "Failed to update menu item. Please try again.",
    };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: number): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath("/menu");
      revalidatePath("/admin/items");
    }

    return {
      success: result.success,
      message: result.message || "Action processed",
    };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return {
      success: false,
      message: "Failed to delete menu item. Please try again.",
    };
  }
}
