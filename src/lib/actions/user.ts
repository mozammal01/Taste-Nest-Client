"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateMyProfile(formData: FormData) {
  if (!API_URL) {
    return { success: false, message: "Server configuration error" };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
  try {
    const res = await fetch(`${API_URL}/user/me`, {
      method: "PATCH",
      headers: {
        Cookie: allCookies,
      },
      body: formData,
    });

    const contentType = res.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
        return { success: false, message: `Server error: ${res.status}. Check backend logs.` };
    }

    const data = await res.json();
    
    if (data.success) {
      revalidatePath("/profile");
      return { success: true, data: data.data };
    }
    
    return { success: false, message: data.message || "Failed to update profile" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return { success: false, message: errorMessage };
  }
}

export async function deleteUser(userId: string, force: boolean = false) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  try {
    const res = await fetch(`${API_URL}/user/${userId}?force=${force}`, {
      method: "DELETE",
      headers: {
        Cookie: allCookies,
      },
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath("/admin/users");
      return { success: true };
    }
    
    if (data.message === "USER_HAS_ORDERS") {
      return { success: false, hasOrders: true, message: "This user already has some orders. Do you still want to delete?" };
    }
    
    return { success: false, message: data.message || "Failed to delete user" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateUserRole(userId: string, role: string) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  try {
    const res = await fetch(`${API_URL}/user/${userId}`, {
      method: "PATCH",
      headers: {
        Cookie: allCookies,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath("/admin/users");
      return { success: true };
    }
    return { success: false, message: data.message || "Failed to update role" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}
