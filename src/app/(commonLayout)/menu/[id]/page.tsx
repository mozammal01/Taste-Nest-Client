import { getMenuItemById, getMenuItemsByCategory } from "@/lib/actions/menu";
import { ItemDetails } from "@/components/menu/ItemDetails";
import { FoodMenuCard } from "@/components/menu/foodMenuCard";
import { notFound } from "next/navigation";

interface MenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { id } = await params;
  const itemId = parseInt(id);

  if (isNaN(itemId)) {
    notFound();
  }

  const item = await getMenuItemById(itemId);

  if (!item) {
    notFound();
  }

  // Fetch related items from the same category
  const allRelatedItems = await getMenuItemsByCategory(item.category);
  const relatedItems = allRelatedItems
    .filter((i) => i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Item Details Section */}
      <section className="relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right -z-10" />
        <ItemDetails item={item} />
      </section>

      {/* Related Products Section */}
      {relatedItems.length > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-3">You might also like</h2>
              <div className="flex justify-between items-end">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Related <span className="text-primary italic">Delicacies</span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedItems.map((relatedItem) => (
                <FoodMenuCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="py-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                <p className="text-xl font-black italic text-slate-400">Trusted By 10k+ Foodies</p>
                <p className="text-xl font-black italic text-slate-400">Award Winning Chefs</p>
                <p className="text-xl font-black italic text-slate-400">Fastest Delivery Guaranteed</p>
                <p className="text-xl font-black italic text-slate-400">Eco-Friendly Packaging</p>
            </div>
        </div>
      </section>
    </div>
  );
}
