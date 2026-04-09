"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/types/menuItems";
import { updateMenuItem } from "@/lib/actions/menu";
import { uploadMenuImage } from "@/lib/actions/upload";

interface FormData {
  name: string;
  content: string;
  category: string;
  price: string;
  image: string;
  discount: string;
  freeDelivery: boolean;
}

const categories = [
  { value: "burger", label: "Burger", icon: "🍔" },
  { value: "steak", label: "Steak", icon: "🥩" },
  { value: "coffee", label: "Coffee", icon: "☕" },
  { value: "dessert", label: "Dessert", icon: "🍰" },
  { value: "pizza", label: "Pizza", icon: "🍕" },
  { value: "pasta", label: "Pasta", icon: "🍝" },
  { value: "salad", label: "Salad", icon: "🥗" },
  { value: "drinks", label: "Drinks", icon: "🥤" },
];

export default function UpdateItemForm({ data }: { data: MenuItem }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: data.name,
    content: data.content,
    category: data.category,
    price: data.price.toString(),
    image: data.image,
    discount: data.discount || "",
    freeDelivery: data.freeDelivery,
  });

  const [imageError, setImageError] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "image") {
      setImageError(false);
    }
    setError(null);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setError(null);
  }, []);

  const handleFreeDeliveryChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, freeDelivery: checked }));
  }, []);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    setSuccess(null);
    setImageError(false);

    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    setIsUploadingImage(true);
    const result = await uploadMenuImage(fd);
    setIsUploadingImage(false);

    if (!result.success || !result.url) {
      setError(result.message);
      return;
    }

    setFormData((prev) => ({ ...prev, image: result.url || "" }));
    setSuccess("Image uploaded successfully");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateMenuItem(data.id, {
        name: formData.name,
        content: formData.content,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        discount: formData.discount || undefined,
        freeDelivery: formData.freeDelivery,
      });

      if (result.success) {
        setSuccess(result.message);
        // Redirect to menu items page after a short delay
        setTimeout(() => {
          router.push("/admin/items");
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.content && formData.category && formData.price && formData.image;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="xl:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-primary/5 to-transparent px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                Basic Information
              </h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Item Name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grilled Ribeye Steak"
                  className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-gray-400">Choose a catchy name that describes your dish</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 font-medium">
                  Description <span className="text-primary">*</span>
                </Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Describe your dish in a mouthwatering way..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-400">{formData.content.length}/200 characters</p>
              </div>

              {/* Category and Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Category <span className="text-primary">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-12 w-full rounded-xl border-gray-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-700 font-medium">
                    Price <span className="text-primary">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="h-12 pl-8 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-blue-50 to-transparent px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                Item Image
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-700 font-medium">
                  Upload Image <span className="text-primary">*</span>
                </Label>
                <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} className="h-12 rounded-xl border-gray-200" />
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>JPG/PNG/WEBP up to 5MB</span>
                  {isUploadingImage && <span className="text-primary font-medium">Uploading...</span>}
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="image" className="text-gray-700 font-medium">
                    Image URL (auto-filled)
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Will be filled after upload"
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                    readOnly
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {!imageError ? (
                    <Image src={formData.image} alt="Preview" fill className="object-cover" onError={() => setImageError(true)} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-sm">Invalid image URL</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Promotions Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-green-50 to-transparent px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                Promotions & Delivery
              </h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Discount */}
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-gray-700 font-medium">
                  Discount Tag <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <Input
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g., 15% OFF, NEW, HOT"
                  className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-gray-400">Add a promotional tag to attract customers</p>
              </div>

              {/* Free Delivery Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-500">Enable free delivery for this item</p>
                  </div>
                </div>
                <Checkbox checked={formData.freeDelivery} onCheckedChange={handleFreeDeliveryChange} className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating Item...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Menu Item
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-xl border-gray-200 hover:border-gray-300"
              onClick={() => {
                setFormData({
                  name: data.name,
                  content: data.content,
                  category: data.category,
                  price: data.price.toString(),
                  image: data.image,
                  discount: data.discount || "",
                  freeDelivery: data.freeDelivery,
                });
                setError(null);
                setSuccess(null);
              }}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="xl:col-span-1">
        <div className="sticky top-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-secondary/20 to-transparent px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
                Live Preview
              </h2>
            </div>

            <div className="p-6">
              {/* Preview Card */}
              <div className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {formData.image && !imageError ? (
                    <Image
                      src={formData.image}
                      alt={formData.name || "Preview"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">Add an image URL</span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {formData.discount && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">{formData.discount}</span>
                    </div>
                  )}

                  {/* Free Delivery Badge */}
                  {formData.freeDelivery && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Free Delivery
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category */}
                  {formData.category && (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3 capitalize">
                      {categories.find((c) => c.value === formData.category)?.icon || ""} {formData.category}
                    </span>
                  )}

                  {/* Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{formData.name || "Item Name"}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {formData.content || "Add a delicious description for your menu item..."}
                  </p>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">${formData.price || "0.00"}</span>
                    </div>

                    <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Tips */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Tips for great listings
                </h4>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Use high-quality, appetizing images</li>
                  <li>• Write descriptive, mouthwatering descriptions</li>
                  <li>• Set competitive pricing</li>
                  <li>• Add promotions to boost sales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
