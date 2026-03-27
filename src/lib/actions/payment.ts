"use server";

import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createPaymentIntent(amount: number) {
  try {
    const result = await handleFetch(`${API_URL}/payment/create-payment-intent`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });

    return result;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return { success: false, message: "Failed to initialize payment." };
  }
}
