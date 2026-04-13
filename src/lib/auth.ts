import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "super_admin" | "admin" | "manager" | "user" | (string & {});

export interface RewardRecord {
  type: 'earn' | 'redeem';
  points: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  _count?: {
    orders: number;
    reservations: number;
    rewards: number;
  };
  rewards?: RewardRecord[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Returns the current authenticated user by calling the backend using the
 * Better-Auth session cookie. Returns null if not authenticated.
 *
 * Expected backend endpoint: GET {API_URL}/user/me
 * Response shape (recommended): { success: boolean, data?: user }
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const allCookiesObj = await cookies();
  const token = allCookiesObj.get(SESSION_COOKIE_NAME)?.value || 
                allCookiesObj.get("better_auth_session_token")?.value ||
                allCookiesObj.get("__Secure-better-auth.session_token")?.value;
                
  if (!token) return null;

  if (!API_URL) {
    console.error("[auth] API_URL is not defined in environment variables");
    return null;
  }

  const allCookies = allCookiesObj.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  try {
    // Calling my custom backend profile endpoint to get rich data (_count, rewards, etc.)
    const res = await fetch(`${API_URL}/user/me`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Cookie: allCookies,
      },
    });

    if (!res.ok) {
        console.error(`[auth] User profile endpoint failed: ${res.status} ${res.statusText}`);
        return null;
    }

    const response = await res.json();
    // Support both { data: user } and direct user object responses
    const user = response?.data || response?.user || (response?.id ? response : null);
    
    if (!user?.id || !user?.email) {
        console.warn("[auth] No valid user data found in profile response", response);
        return null;
    }

    return user;
  } catch (err) {
    console.error("[auth] Error fetching current user:", err);
    return null;
  }
}

 /**
 * Redirects to /signin if no valid authenticated session exists.
 * Use inside Server Components / Server Layouts.
 */
export async function requireAuth(options?: { callbackUrl?: string; message?: string }) {
  const user = await getCurrentUser();
  if (user) return user;

  const callbackUrl = options?.callbackUrl ?? "/";
  const message = options?.message ? `&message=${encodeURIComponent(options.message)}` : "";
  redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}${message}`);
}

/**
 * Redirects to /unauthorized if the user is not an admin.
 */
export async function requireAdmin(options?: { redirectTo?: string }) {
  const user = await requireAuth();
  if (user.role === "admin" || user.role === "super_admin") return user;
  redirect(options?.redirectTo ?? "/unauthorized");
}

/**
 * Redirects to /unauthorized if the user is not a manager or admin.
 */
export async function requireManager(options?: { redirectTo?: string }) {
  const user = await requireAuth();
  if (user.role === "manager" || user.role === "admin" || user.role === "super_admin") return user;
  redirect(options?.redirectTo ?? "/unauthorized");
}

/**
 * Redirects to /unauthorized if the user is not a staff member (manager or admin).
 * Staff role includes anyone who can access the management dashboards.
 */
export async function requireStaff(options?: { redirectTo?: string }) {
  const user = await requireAuth();
  const staffRoles: UserRole[] = ["admin", "super_admin", "manager"];
  if (staffRoles.includes(user.role)) return user;
  redirect(options?.redirectTo ?? "/unauthorized");
}

