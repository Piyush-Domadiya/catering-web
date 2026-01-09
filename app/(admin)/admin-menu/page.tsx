import { getMenuItems, getCategories } from "@/app/actions/menu";
import { MenuManager } from "@/components/admin/MenuManager";

export default async function AdminMenuPage() {
  const [itemsResult, categoriesResult] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  const items = itemsResult.success ? itemsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <MenuManager initialItems={items || []} categories={categories || []} />
  );
}
