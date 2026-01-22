import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get counts
    const [customerCount, eventCount, staffCount, upcomingEventsCount] =
      await Promise.all([
        prisma.customer.count({ where: { businessId } }),
        prisma.event.count({ where: { businessId } }),
        prisma.staff.count({ where: { businessId } }),
        prisma.event.count({ where: { status: "UPCOMING", businessId } }),
      ]);

   const completedEventsCount = await prisma.event.count({
        where: { status: "COMPLETED", businessId },
   });

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
        businessId,
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get event type stats
    const eventTypeStats = await prisma.event.groupBy({
      by: ["type"],
      where: { businessId },
      _count: {
        type: true,
      },
      orderBy: {
        _count: {
          type: "desc",
        },
      },
      take: 3,
    });

    // Calculate stats
    const stats = {
      totalCustomers: customerCount,
      totalEvents: eventCount,
      totalStaff: staffCount,
      upcomingEvents: upcomingEventsCount,
      completedEvents: completedEventsCount,
      recentEvents: recentEvents.map((event) => ({
        id: event.id,
        name: event.name,
        customer: event.customer?.name || "Unknown",
        customerId: event.customerId,
        date: event.date,
        time: event.time,
        status: event.status,
        type: event.type,
        location: event.location,
      })),
      topEventTypes: eventTypeStats.map((stat) => ({
        type: stat.type,
        count: stat._count?.type || 0,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET_DASHBOARD_STATS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
