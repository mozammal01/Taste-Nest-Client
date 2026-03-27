"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItemWithDetails } from "@/types/cartItem";
import { updateCartItemQuantity, deleteCartItem } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemWithDetails;
  index: number;
}

export default function CartItemCard({ item, index }: CartItemProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    setQuantity(newQuantity);

    const result = await updateCartItemQuantity(item.id, newQuantity);
    if (!result.success) {
      setQuantity(item.quantity); // Revert on error
      toast.error(result.message);
    }
    router.refresh();
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    const result = await deleteCartItem(item.id);
    if (result.success) {
      toast.success(`${item.menuItem.name} removed from cart`);
    } else {
      toast.error(result.message);
      setIsDeleting(false);
    }
    router.refresh();
  };

  const itemTotal = item.menuItem.price * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
        <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
        {item.menuItem.discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">{item.menuItem.discount}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{item.menuItem.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{item.menuItem.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-1"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{item.menuItem.category}</span>
            {item.menuItem.freeDelivery && (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">Free Delivery</span>
            )}
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">$</span>
            <span className="text-xl font-bold text-primary">{Number(item.menuItem.price).toFixed(2)}</span>
            <span className="text-sm text-gray-400">each</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-10 text-center font-medium text-gray-900">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Item Total */}
            <div className="text-right min-w-[80px]">
              <span className="text-lg font-bold text-gray-900">${itemTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
