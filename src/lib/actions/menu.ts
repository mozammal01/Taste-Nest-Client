"use server";

import { revalidatePath } from "next/cache";
import type { MenuItem } from "@/types/menuItems";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      headers: {
        "Content-Type": "application/json",
      },
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
