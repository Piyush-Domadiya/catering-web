"use server";

import prisma from "@/lib/prisma";

export async function getPublicMenu() {
  try {
    const [categories, items] = await Promise.all([
      prisma.menuCategory.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.menuItem.findMany({
        where: { available: true },
        include: { category: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return { success: true, categories, items };
  } catch (error) {
    console.error("Failed to fetch public menu:", error);
    return { success: false, error: "Failed to load menu" };
  }
}
