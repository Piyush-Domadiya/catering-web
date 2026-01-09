import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Export all data from all tables
    const [customers, events, staff, menuCategories, menuItems, users] =
      await Promise.all([
        prisma.customer.findMany({ include: { events: true } }),
        prisma.event.findMany({
          include: {
            customer: true,
            staff: true,
            images: true,
          },
        }),
        prisma.staff.findMany({ include: { events: true } }),
        prisma.menuCategory.findMany({ include: { items: true } }),
        prisma.menuItem.findMany({ include: { category: true } }),
        prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      ]);

    const backup = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      data: {
        customers,
        events,
        staff,
        menuCategories,
        menuItems,
        users,
      },
    };

    return NextResponse.json(backup);
  } catch (error) {
    console.error("BACKUP_EXPORT_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
