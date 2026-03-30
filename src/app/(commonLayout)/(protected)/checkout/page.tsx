import { getCurrentUser } from "@/lib/auth";
import { getCartItemsWithDetails } from "@/lib/actions/cart";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";


export const metadata = {
  title: "Checkout | TasteNest",
  description: "Complete your order with secure checkout",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const cartItems = await getCartItemsWithDetails();

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <>

      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
            <CheckoutForm items={cartItems} userId={user.id} />
          </div>
        </div>
      </main>
    </>
  );
}
