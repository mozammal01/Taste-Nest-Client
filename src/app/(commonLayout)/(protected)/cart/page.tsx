import { getCurrentUser } from "@/lib/auth";
import { getCartItemsWithDetails } from "@/lib/actions/cart";
import { redirect } from "next/navigation";
import Cart from "@/components/cart/Cart";
import Navigation from "@/components/home/navigation";

export const metadata = {
  title: "Shopping Cart | TasteNest",
  description: "Review your cart and checkout",
};

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const cartItems = await getCartItemsWithDetails(user.id);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
          </div>
        </div>

        {/* Cart Content */}
        <div className="container mx-auto px-4 py-8">
          <Cart items={cartItems} userId={user.id} />
        </div>
      </main>
    </>
  );
}
