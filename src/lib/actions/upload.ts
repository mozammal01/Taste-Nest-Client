"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
}

export async function uploadMenuImage(formData: FormData): Promise<UploadResult> {
  try {
    const res = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      credentials: "include",
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

