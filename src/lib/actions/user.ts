"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateMyProfile(formData: FormData) {
  console.log("[update-profile] Server action triggered");
  
  if (!API_URL) {
    console.error("[update-profile] ERROR: NEXT_PUBLIC_API_URL is missing!");
    return { success: false, message: "Server configuration error" };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
  console.log("[update-profile] Fetching backend:", `${API_URL}/user/me`);
  
  try {
    const res = await fetch(`${API_URL}/user/me`, {
      method: "PATCH",
      headers: {
        Cookie: allCookies,
      },
      body: formData,
    });

    console.log("[update-profile] Backend response status:", res.status);

    // Handle potential non-JSON errors (e.g. 500 from backend)
    const contentType = res.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
        const textError = await res.text();
        console.error(`[update-profile] Backend error [${res.status}]:`, textError);
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
    console.error("[update-profile] Server action crash:", error);
    return { success: false, message: errorMessage };
  }
}
