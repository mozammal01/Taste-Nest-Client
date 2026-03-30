"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "better-auth.session_token";

export async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  
  // Find the session token under any of its potential names
  const sessionCookie = 
    cookieStore.get("__Secure-better-auth.session_token") ||
    cookieStore.get("better-auth.session_token") || 
    cookieStore.get("better_auth_session_token");

  if (!sessionCookie) {
    return { "Content-Type": "application/json" };
  }

  return { 
    Cookie: `${sessionCookie.name}=${sessionCookie.value}`, 
    "Content-Type": "application/json" 
  };
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
