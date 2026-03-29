"use server";

import { revalidatePath } from "next/cache";
import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ReservationInput {
  date: string;
  time: string;
  guests: number;
  message?: string;
}

export async function createReservation(input: ReservationInput) {
  const result = await handleFetch(`${API_URL}/reservation`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (result.success) {
    revalidatePath("/user/reservations");
  }

  return result;
}

export async function getMyReservations() {
  const result = await handleFetch(`${API_URL}/reservation/my-reservations`, {
    cache: "no-store",
  });
  return result;
}

export async function cancelReservation(id: number) {
  const result = await handleFetch(`${API_URL}/reservation/${id}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/user/reservations");
  }

  return result;
}
