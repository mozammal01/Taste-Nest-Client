import FoodMenu from "./foodMenu";
import { getMenuItems, getMenuItemsByCategory } from "@/lib/actions/menu";
import { getCurrentUser } from "@/lib/auth";

export default async function Menu({ category, search, minPrice, maxPrice }: { category?: string; search?: string; minPrice?: string; maxPrice?: string; }) {
  // Normalize category for backend/matching
  const normalizedCategory = category?.toLowerCase().trim();
  
  // Fetch menu items and user on the server
  const fetchMenuItems =
    normalizedCategory && normalizedCategory !== "all" 
      ? getMenuItemsByCategory(normalizedCategory) 
      : getMenuItems();

  const [menuItems, user] = await Promise.all([fetchMenuItems, getCurrentUser()]);

  return <FoodMenu items={menuItems} user={user} search={search} minPrice={minPrice} maxPrice={maxPrice} />;
}

