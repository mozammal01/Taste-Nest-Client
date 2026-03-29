import { getCurrentUser } from "@/lib/auth";
import { getMyFavorites } from "@/lib/actions/favorite";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star,
  Zap,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Favorites | TasteNest",
  description: "Your collection of favorite dishes",
};

export default async function MyFavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const result = await getMyFavorites();
  const favorites = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
              <Heart className="w-3 h-3 fill-primary" />
              <span>Personal Collection</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Favorite Dishes</h1>
            <p className="text-gray-500 mt-2 font-medium">Quickly reorder the tastes you love the most.</p>
          </div>
          <Link href="/menu">
            <Button variant="outline" className="border-2 border-gray-100 h-14 px-8 rounded-2xl font-bold bg-white hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 group leading-none">
              Explore More
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((favorite: any) => (
              <Card key={favorite.id} className="border-gray-100 shadow-xl shadow-gray-200/20 rounded-3xl overflow-hidden ring-1 ring-black/2 group hover:-translate-y-2 transition-all duration-500 bg-white">
                <CardContent className="p-0">
                  {/* Image Section */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={favorite.menuItem.image || "/placeholder.png"} 
                      alt={favorite.menuItem.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-primary hover:bg-primary border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-primary/30">
                        {favorite.menuItem.category}
                      </Badge>
                      {favorite.menuItem.freeDelivery && (
                        <Badge className="bg-white/90 backdrop-blur-md text-primary hover:text-primary border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                          Free Delivery
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-primary transition-colors truncate pr-4">
                            {favorite.menuItem.name}
                        </h3>
                        <p className="text-xl font-extrabold text-primary tracking-tighter shrink-0">
                            ${Number(favorite.menuItem.price).toFixed(2)}
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 leading-relaxed h-10">
                      {favorite.menuItem.content || "Experience the perfect blend of ingredients and flavors in this masterpiece."}
                    </p>

                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50 mt-auto">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 leading-none px-0">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Quick Order
                      </Button>
                      <Button variant="ghost" className="w-12 h-12 p-0 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-3xl p-20 flex flex-col items-center justify-center text-center">
             <div className="relative mb-8">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center ring-8 ring-gray-50/50">
                <Heart className="w-10 h-10 text-gray-300 fill-gray-50" />
              </div>
              <div className="absolute top-0 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Collection is empty</h3>
            <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
                Tap the heart icon on any dish to save it here for later. All your favorites will be here.
            </p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group leading-none">
                Browse Menu
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
