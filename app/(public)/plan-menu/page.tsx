import { PublicMenuBuilder } from "@/components/public/PublicMenuBuilder";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh data on every request

async function getMenuData() {
  const [categories, items] = await Promise.all([
    prisma.menuCategory.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.menuItem.findMany({
      where: { available: true },
      include: {
        category: true,
      },
    }),
  ]);

  return { categories, items };
}

export default async function PlanMenuPage() {
  const { categories, items } = await getMenuData();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Build Your Perfect Menu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select your favorite dishes, see an estimated price, and send us
            your custom menu directly via WhatsApp.
          </p>
        </div>

        <PublicMenuBuilder
          initialCategories={categories}
          initialItems={items}
        />
      </div>
    </div>
  );
}
