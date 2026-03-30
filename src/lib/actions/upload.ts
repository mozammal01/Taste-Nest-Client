"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
}

export async function uploadMenuImage(formData: FormData): Promise<UploadResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = 
      cookieStore.get("__Secure-better-auth.session_token") ||
      cookieStore.get("better-auth.session_token") || 
      cookieStore.get("better_auth_session_token");

    const headers: Record<string, string> = {};
    if (sessionCookie) {
      headers["Cookie"] = `${sessionCookie.name}=${sessionCookie.value}`;
    }

    const res = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers,
      body: formData,
    });

    const result = (await res.json()) as { success?: boolean; message?: string; data?: { url?: string } };

    if (!res.ok || !result.success || !result.data?.url) {
      return { success: false, message: result.message || "Failed to upload image." };
    }

    return { success: true, message: result.message || "Uploaded", url: result.data.url };
  } catch {
    return { success: false, message: "Failed to upload image. Please try again." };
  }
}

