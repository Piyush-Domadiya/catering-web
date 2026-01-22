"use server";

import prisma from "@/lib/prisma";

export async function getPublicEvents(options?: { limit?: number }) {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "COMPLETED", // Show completed events in gallery
        images: {
          some: {}, // Only show events that have images
        },
      },
      include: {
        images: true,
      },
      orderBy: {
        date: "desc",
      },
      take: options?.limit,
    });

    // Transform to match UI requirements
    return events.map((event) => ({
      id: event.id,
      title: event.name,
      category: event.type,
      image: event.images[0]?.url || "",
      description: `A ${event.type} event at ${event.location}`,
      date: event.date,
      time: event.time,
    }));
  } catch (error) {
    console.error("Failed to fetch public events:", error);
    return [];
  }
}
