import UpdateMenuItem from "@/components/admin-menu-items/updateItem/updateMenuItem";
import { getMenuItemById } from "@/lib/actions/menu";
import { notFound } from "next/navigation";

interface UpdateItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateItemPage({ params }: UpdateItemPageProps) {
  const { id } = await params;
  const itemId = parseInt(id, 10);

  if (isNaN(itemId)) {
    notFound();
  }

  const item = await getMenuItemById(itemId);

  if (!item) {
    notFound();
  }

  return <UpdateMenuItem item={item} />;
}
