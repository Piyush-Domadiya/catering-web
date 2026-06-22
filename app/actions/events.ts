"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUpcomingEvents() {
  const session = await auth();
  if (!session?.user?.businessId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        businessId: session.user.businessId,
        date: {
          gte: new Date(), // Only upcoming events
        },
      },
      orderBy: {
        date: "asc",
      },
      select: {
        id: true,
        name: true,
        date: true,
        type: true,
      },
    });

    return { success: true, data: events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}
