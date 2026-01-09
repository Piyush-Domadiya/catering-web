"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function getMenuItems() {
  try {
    const items = await prisma.menuItem.findMany({
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
    const categories = await prisma.menuCategory.findMany({
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
    await checkAdmin();
    const validated = MenuItemSchema.parse(data);

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
    await checkAdmin();
    const validated = MenuItemSchema.parse(data);

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
    await checkAdmin();

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
        await checkAdmin();
        const category = await prisma.menuCategory.create({
            data: { name }
        });
        revalidatePath("/admin-menu");
        return { success: true, data: category };
    } catch (error) {
        console.error("Found error creating category", error);
        return { success: false, error: "Failed to create category"};
    }
}
