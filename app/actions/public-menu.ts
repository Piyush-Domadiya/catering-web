"use server";

import prisma from "@/lib/prisma";

export async function getPublicMenu() {
  try {
    // Get the first business or ideally from a config/settings
    const business = await prisma.business.findFirst();
    if (!business) return { success: false, error: "Business not found" };

    const [categories, items] = await Promise.all([
      prisma.menuCategory.findMany({
        where: { businessId: business.id },
        orderBy: { name: "asc" },
      }),
      prisma.menuItem.findMany({
        where: { 
          available: true,
          category: { businessId: business.id }
        },
        include: { 
          category: true,
          reviews: {
            select: { 
              id: true,
              name: true,
              rating: true,
              content: true,
              createdAt: true
            },
            orderBy: { createdAt: "desc" }
          }
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const itemsWithStats = (items as any[]).map(item => {
      const reviewCount = item.reviews.length;
      const averageRating = reviewCount > 0 
        ? item.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewCount 
        : 0;
      
      return {
        ...item,
        reviewCount,
        averageRating,
        reviews: item.reviews
      };
    });

    return { success: true, categories, items: itemsWithStats };
  } catch (error) {
    console.error("Failed to fetch public menu:", error);
    return { success: false, error: "Failed to load menu" };
  }
}
