import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const businessId = await getCurrentBusinessId();

    if (!session || session.user.role !== "ADMIN" || !businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Export all data from all tables for the current business
    const [customers, events, staff, menuCategories, menuItems, users] =
      await Promise.all([
        prisma.customer.findMany({ 
            where: { businessId },
            include: { events: true } 
        }),
        prisma.event.findMany({
          where: { businessId },
          include: {
            customer: true,
            staff: true,
            images: true,
          },
        }),
        prisma.staff.findMany({ 
            where: { businessId },
            include: { events: true } 
        }),
        prisma.menuCategory.findMany({ 
            where: { businessId },
            include: { items: true } 
        }),
        prisma.menuItem.findMany({ 
            where: { category: { businessId } },
            include: { category: true } 
        }),
        prisma.user.findMany({
          where: { businessId },
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
      businessId,
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
