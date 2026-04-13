"use server";

import { revalidatePath } from "next/cache";
import { handleFetch } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OrderInput {
  items: {
    menuItemId: number;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  address: string;
  phone: string;
  transactionId?: string;
  paymentStatus?: string;
}

export async function createOrder(input: OrderInput) {
  const result = await handleFetch(`${API_URL}/order`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (result.success) {
    revalidatePath("/cart");
    revalidatePath("/user/orders");
  }

  return result;
}

export async function getMyOrders() {
    const result = await handleFetch(`${API_URL}/order/my-orders`, {
      cache: "no-store",
    });
    return result;
}

export async function getAllOrders() {
    const result = await handleFetch(`${API_URL}/order`, {
      cache: "no-store",
    });
    return result;
}

export async function updateOrderStatus(orderId: number, status: string) {
    const result = await handleFetch(`${API_URL}/order/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    
    if (result.success) {
      revalidatePath("/admin/orders");
      revalidatePath("/manager/orders");
    }
    
    return result;
}
