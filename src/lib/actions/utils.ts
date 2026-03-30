"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "better-auth.session_token";

export async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value || 
                cookieStore.get("better_auth_session_token")?.value ||
                cookieStore.get("__Secure-better-auth.session_token")?.value;

  return token
    ? { Cookie: `better-auth.session_token=${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function handleFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
          ...(options?.headers || {}),
          ...await getAuthHeaders()
      },
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`FETCH ERROR [${response.status}] at ${url}:`, text);
        return { success: false, message: text || "Server Error", data: null };
    }

    return await response.json();
  } catch (error) {
    console.error(`FETCH EXCEPTION at ${url}:`, error);
    return { success: false, message: "Network error or invalid JSON", data: null };
  }
}
