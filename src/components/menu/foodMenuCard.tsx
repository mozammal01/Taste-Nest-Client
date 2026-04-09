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
import { ShoppingCart, Check, AlertCircle, Eye, Star } from "lucide-react";
import { useSession } from "@/lib/auth-client";

import { DeleteConfirmationModal } from "../ui/delete-confirmation-modal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOrderingNow, setIsOrderingNow] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMenuItem(item.id);
      if (result.success) {
        toast.success("Item deleted successfully", {
          description: `"${item.name}" has been removed.`,
          icon: <Check className="w-5 h-5" />,
        });
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete item", {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        icon: <AlertCircle className="w-5 h-5" />,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteItem = () => {
    setShowDeleteModal(true);
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
      className="h-full"
    >
      <Card className="h-full flex flex-col min-h-[500px] rounded-[32px] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden hover:shadow-2xl transition-all duration-500">
        <CardHeader className="p-0 overflow-hidden relative group">
          <Lens zoomFactor={2} lensSize={150} isStatic={false} ariaLabel="Zoom Area">
            <div className="w-full h-[300px] overflow-hidden rounded-t-[32px] relative">
              <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              
              {/* Overlay Tags */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {item.discount && (
                  <div className="bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    {item.discount} OFF
                  </div>
                )}
                {item.freeDelivery && (
                  <div className="bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    FREE DELIVERY
                  </div>
                )}
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 right-4 z-20">
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-2xl font-black text-primary italic leading-none">
                    ${item.price}
                  </span>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          </Lens>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-xs font-black text-primary uppercase tracking-widest bg-primary/5 w-fit px-2 py-0.5 rounded-md">
                {item.category}
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {item.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-yellow-700 dark:text-yellow-500">4.9</span>
            </div>
          </div>
          <div className="min-h-[3rem]">
            <CardDescription className="line-clamp-2 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {item.content}
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 p-6 pt-0 mt-auto">
          {currentRole === "admin" ? (
            <>
              <AnimatedButton
                onClick={handleDeleteItem}
                className="flex-1 h-12 rounded-xl font-bold"
                variant="ripple"
                size="lg"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => handleEditItem(item.id)}
                className="flex-1 h-12 rounded-xl font-bold"
                variant="rippleYellow"
                size="lg"
              >
                Edit
              </AnimatedButton>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <AnimatedButton
                  onClick={() => router.push(`/menu/${item.id}`)}
                  className="w-12 h-12 p-0 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary border border-slate-200 dark:border-slate-700"
                  variant="ripple"
                  size="icon"
                  aria-label="View Details"
                >
                  <Eye className="w-5 h-5" />
                </AnimatedButton>
                
                <AnimatedButton
                  onClick={() => handleAddToCart(item.id)}
                  className="flex-1 min-w-[120px] h-12 rounded-xl font-bold"
                  variant="rippleYellow"
                  size="lg"
                  disabled={isAddingToCart || isOrderingNow}
                >
                  {isAddingToCart ? (
                    <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                    </span>
                  )}
                </AnimatedButton>
              </div>

              <AnimatedButton
                onClick={handleOrderNow}
                className="flex-1 sm:flex-none sm:min-w-[140px] h-12 rounded-xl font-black bg-primary text-white shadow-lg shadow-primary/30"
                variant="ripple"
                size="lg"
                disabled={isOrderingNow || isAddingToCart}
              >
                {isOrderingNow ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Order Now"
                )}
              </AnimatedButton>
            </>
          )}
        </CardFooter>
      </Card>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Menu Item?"
        description="Are you absolutely sure you want to remove this item from the menu? This action cannot be undone."
        itemName={item.name}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
