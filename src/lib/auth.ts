import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "user" | (string & {});

export interface CurrentUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE_NAME = "better-auth.session_token";

async function getSessionTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

/**
 * Returns the current authenticated user by calling the backend using the
 * Better-Auth session cookie. Returns null if not authenticated.
 *
 * Expected backend endpoint: GET {API_URL}/user/me
 * Response shape (recommended): { success: boolean, data?: user }
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;

  if (!API_URL) {
    // If API url isn't configured, we can't resolve the user.
    // Treat as unauthenticated to avoid leaking protected pages.
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/user/me`, {
      method: "GET",
      cache: "no-store",
      headers: {
        // Forward cookie to backend so it can resolve the session
        Cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    if (!res.ok) return null;

    const result = (await res.json()) as { success?: boolean; data?: CurrentUser };
    const user = result?.data;
    if (!user?.id || !user?.email || !user?.role) return null;

    return user;
  } catch {
    return null;
  }
}

/**
 * Redirects to /signin if no valid authenticated session exists.
 * Use inside Server Components / Server Layouts.
 */
export async function requireAuth(options?: { callbackUrl?: string }) {
  const user = await getCurrentUser();
  if (user) return user;

  const callbackUrl = options?.callbackUrl ?? "/";
  redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

/**
 * Redirects to /dashboard if the user is not an admin.
 */
export async function requireAdmin(options?: { redirectTo?: string }) {
  const user = await requireAuth();
  if (user.role === "admin") return user;
  redirect(options?.redirectTo ?? "/dashboard");
}

