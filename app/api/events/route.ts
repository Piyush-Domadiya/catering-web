import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { staff: true },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET_EVENTS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, date, time, location, type, customerId, status } =
      await req.json();

    if (!name || !date || !location || !type || !customerId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        time,
        location,
        type,
        customerId,
        status: status || "UPCOMING",
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("CREATE_EVENT_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
