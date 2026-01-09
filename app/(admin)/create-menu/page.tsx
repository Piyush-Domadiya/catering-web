import { getMenuItems, getCategories } from "@/app/actions/menu";
import { CreateMenuBuilder } from "@/components/admin/CreateMenuBuilder";

export const metadata = {
  title: "Create Custom Menu | Admin",
  description:
    "Build a custom menu by selecting items from the available list.",
};

export default async function CreateMenuPage() {
  const [itemsResult, categoriesResult] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const itemsRaw = itemsResult.success ? itemsResult.data : [];
  const categoriesRaw = categoriesResult.success ? categoriesResult.data : [];

  // Serialize data to avoid "Date object not supported" error in Client Component
  const items =
    itemsRaw?.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      category: {
        id: item.category.id,
        name: item.category.name,
      },
      image: item.image,
      available: item.available,
    })) || [];

  const categories =
    categoriesRaw?.map((cat) => ({
      id: cat.id,
      name: cat.name,
    })) || [];

  return (
    <div className="p-6">
      <CreateMenuBuilder initialItems={items} categories={categories} />
    </div>
  );
}
