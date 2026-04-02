"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lens } from "@/components/ui/lens";
import Image from "next/image";
import { AnimatedButton } from "../ui/animated-button";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/types/menuItems";
import { deleteMenuItem } from "@/lib/actions/menu";
import { createCartItem } from "@/lib/actions/cart";
import { toast } from "sonner";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface FoodMenuCardProps {
  item: MenuItem;
  userRole?: string;
  user?: { id: string } | null;
}

export function FoodMenuCard({ item, userRole, user: serverUser }: FoodMenuCardProps) {
  const { data: session } = useSession();
  const user = session?.user || serverUser;
  const currentRole = userRole || (user as { role?: string })?.role;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOrderingNow, setIsOrderingNow] = useState(false);

  const handleDeleteItem = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteMenuItem(item.id);
      if (result.success) {
        toast.success("Item deleted successfully");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditItem = (id: number) => {
    router.push(`/admin/items/update-item/${id}`);
  };

  const handleOrderNow = async () => {
    if (!user) {
      toast.error("Please sign in to place an order", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/signin"),
        },
      });
      return;
    }

    setIsOrderingNow(true);
    try {
      const result = await createCartItem({
        menuItemId: item.id,
        quantity: 1,
      });

      if (result.success) {
        router.push("/cart");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsOrderingNow(false);
    }
  };

  const handleAddToCart = async (id: number) => {
    if (!user) {
      toast.error("Please sign in to add items to cart", {
        icon: <AlertCircle className="w-5 h-5" />,
        action: {
          label: "Sign In",
          onClick: () => router.push("/signin"),
        },
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await createCartItem({
        menuItemId: id,
        quantity: 1,
      });

      if (result.success) {
        toast.success(`${item.name} added to cart!`, {
          icon: <Check className="w-5 h-5" />,
          description: "View your cart to checkout",
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
        router.refresh();
      } else {
        toast.error(result.message, {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      }
    } catch {
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card>
        <CardHeader>
          <Lens zoomFactor={2} lensSize={150} isStatic={false} ariaLabel="Zoom Area">
            <div className="w-full h-[300px] overflow-hidden rounded-t-2xl relative">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
              <div className="absolute top-2 left-1 w-full h-full flex justify-start items-start gap-2">
                {item.discount && (
                  <div className="bg-primary text-white w-fit px-2 rounded-full">
                    {item.discount}
                  </div>
                )}
                {item.freeDelivery && (
                  <div className="bg-primary text-white w-fit px-2 rounded-full">
                    {item.freeDelivery ? "Free Delivery" : ""}
                  </div>
                )}
              </div>
            </div>
          </Lens>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-2xl">{item.name}</CardTitle>
          <CardDescription>{item.content}</CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto">
          {currentRole === "admin" ? (
            <div className="flex flex-col w-full gap-2">
              <AnimatedButton
                onClick={handleDeleteItem}
                className="cursor-pointer w-full"
                variant="ripple"
                size="default"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Item"}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleEditItem(item.id)}
                className="cursor-pointer w-full"
                variant="rippleYellow"
                size="default"
              >
                Edit Item
              </AnimatedButton>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 justify-end items-center">
              <AnimatedButton
                onClick={handleOrderNow}
                className="cursor-pointer flex-1 w-full"
                variant="ripple"
                size="default"
                disabled={isOrderingNow || isAddingToCart}
              >
                {isOrderingNow ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Order Now"
                )}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleAddToCart(item.id)}
                className="cursor-pointer flex-1 w-full"
                variant="rippleYellow"
                size="default"
                disabled={isAddingToCart || isOrderingNow}
              >
                {isAddingToCart ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </span>
                )}
              </AnimatedButton>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
