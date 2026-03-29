"use server";

import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMyRewards() {
  const result = await handleFetch(`${API_URL}/reward/my-rewards`, {
    cache: "no-store",
  });
  return result;
}
