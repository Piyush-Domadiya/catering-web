"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

const MenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  available: z.boolean().default(true),
});

export type MenuItemData = z.infer<typeof MenuItemSchema>;

async function checkAdmin() {
  const session = await auth();
  const businessId = await getCurrentBusinessId();
  if (!session || session.user.role !== "ADMIN" || !businessId) {
    throw new Error("Unauthorized: Admin access required");
  }
  return { session, businessId };
}

export async function getMenuItems() {
  try {
    const businessId = await getCurrentBusinessId();
    if (!businessId) return { success: false, error: "Unauthorized" };

    const items = await prisma.menuItem.findMany({
      where: {
        category: {
            businessId: businessId
        }
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    return { success: false, error: "Failed to fetch menu items" };
  }
}

export async function getCategories() {
  try {
    const businessId = await getCurrentBusinessId();
    if (!businessId) return { success: false, error: "Unauthorized" };

    const categories = await prisma.menuCategory.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createMenuItem(data: MenuItemData) {
  try {
    const { businessId } = await checkAdmin();
    const validated = MenuItemSchema.parse(data);

    // Verify category belongs to business
    const category = await prisma.menuCategory.findFirst({
        where: { id: validated.categoryId, businessId }
    });

    if (!category) {
        return { success: false, error: "Invalid category" };
    }

    await prisma.menuItem.create({
      data: validated,
    });

    revalidatePath("/admin-menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    console.error("Failed to create menu item:", error);
    return { success: false, error: "Failed to create menu item" };
  }
}

export async function updateMenuItem(id: string, data: MenuItemData) {
  try {
    const { businessId } = await checkAdmin();
    const validated = MenuItemSchema.parse(data);

     // Verify category belongs to business
    const category = await prisma.menuCategory.findFirst({
        where: { id: validated.categoryId, businessId }
    });

    if (!category) {
        return { success: false, error: "Invalid category" };
    }
    
    // Also verify item belongs to business (via category)
    const item = await prisma.menuItem.findFirst({
        where: { 
            id,
            category: { businessId }
        }
    });

    if (!item) {
         return { success: false, error: "Item not found or unauthorized" };
    }

    await prisma.menuItem.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin-menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return { success: false, error: "Failed to update menu item" };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const { businessId } = await checkAdmin();

    // Verify item belongs to business
    const item = await prisma.menuItem.findFirst({
        where: { 
            id,
            category: { businessId }
        }
    });

    if (!item) {
         return { success: false, error: "Item not found or unauthorized" };
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    revalidatePath("/admin-menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
}

export async function createCategory(name: string) {
    try {
        const { businessId } = await checkAdmin();
        const category = await prisma.menuCategory.create({
            data: { 
                name,
                businessId
            }
        });
        revalidatePath("/admin-menu");
        return { success: true, data: category };
    } catch (error) {
        console.error("Found error creating category", error);
        return { success: false, error: "Failed to create category"};
    }
}
