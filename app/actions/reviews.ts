"use server";

import prisma from "@/lib/prisma";

export async function submitReview(data: {
  itemId: string;
  name: string;
  phone: string;
  rating: number;
  content?: string;
}) {
  try {
    const { itemId, name, phone, rating, content } = data;

    if (!itemId || !name || !phone || !rating) {
      return { success: false, error: "Missing required fields" };
    }

    // Find the item to get its businessId
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        category: {
          select: { businessId: true }
        }
      }
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    const targetBusinessId = item.category.businessId;

    const review = await prisma.review.create({
      data: {
        itemId,
        name,
        phone,
        rating: Math.min(5, Math.max(1, rating)),
        content,
        businessId: targetBusinessId
      }
    });

    return { success: true, review };
  } catch (error) {
    console.error("SUBMIT_REVIEW_ERROR", error);
    return { success: false, error: "Failed to submit review" };
  }
}
