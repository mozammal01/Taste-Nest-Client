"use server";

import { revalidatePath } from "next/cache";
import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMyFavorites() {
  const result = await handleFetch(`${API_URL}/favorite/my-favorites`, {
    cache: "no-store",
  });
  return result;
}

export async function toggleFavorite(menuItemId: number) {
  const result = await handleFetch(`${API_URL}/favorite/toggle`, {
    method: "POST",
    body: JSON.stringify({ menuItemId }),
  });

  if (result.success) {
    revalidatePath("/menu");
    revalidatePath("/user/favorites");
  }

  return result;
}
