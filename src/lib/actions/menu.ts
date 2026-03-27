"use server";

import { revalidatePath } from "next/cache";
import type { MenuItem } from "@/types/menuItems";
import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch all menu items from the backend
 */
export async function getMenuItems(): Promise<MenuItem[]> {
    const result = await handleFetch(`${API_URL}/menu`, { cache: "no-store" });
    return result.success ? result.data : [];
}

/**
 * Fetch menu items filtered by category
 */
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    const result = await handleFetch(`${API_URL}/menu?category=${category}`, { cache: "no-store" });
    return result.success ? result.data : [];
}

/**
 * Fetch a single menu item by ID
 */
export async function getMenuItemById(id: number): Promise<MenuItem | null> {
    const result = await handleFetch(`${API_URL}/menu/${id}`, { cache: "no-store" });
    return result.success ? result.data : null;
}

/**
 * Get all unique categories from menu items
 */
export async function getMenuCategories(): Promise<string[]> {
    const result = await handleFetch(`${API_URL}/menu/categories`, { cache: "no-store" });
    return result.success ? result.data : [];
}

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
  const result = await handleFetch(`${API_URL}/menu`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (result.success) {
    revalidatePath("/menu");
    revalidatePath("/admin/items");
  }

  return {
    success: result.success,
    message: result.message || "Action processed",
    data: result.data,
  };
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(id: number, input: MenuItemInput): Promise<ActionResult> {
  const result = await handleFetch(`${API_URL}/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

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
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: number): Promise<ActionResult> {
  const result = await handleFetch(`${API_URL}/menu/${id}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/menu");
    revalidatePath("/admin/items");
  }

  return {
    success: result.success,
    message: result.message || "Action processed",
  };
}
