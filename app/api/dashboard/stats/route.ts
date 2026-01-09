import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get counts
    const [customerCount, eventCount, staffCount, upcomingEventsCount] =
      await Promise.all([
        prisma.customer.count(),
        prisma.event.count(),
        prisma.staff.count(),
        prisma.event.count({ where: { status: "UPCOMING" } }),
      ]);

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
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
      completedEvents: await prisma.event.count({
        where: { status: "COMPLETED" },
      }),
      recentEvents: recentEvents.map((event) => ({
        id: event.id,
        name: event.name,
        customer: event.customer.name,
        customerId: event.customerId,
        date: event.date,
        time: event.time,
        status: event.status,
        type: event.type,
        location: event.location,
      })),
      topEventTypes: eventTypeStats.map((stat) => ({
        type: stat.type,
        count: stat._count.type,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET_DASHBOARD_STATS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
