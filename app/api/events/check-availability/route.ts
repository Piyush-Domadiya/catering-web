import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return new NextResponse("Date is required", { status: 400 });
    }

    const date = new Date(dateStr);
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const count = await prisma.event.count({
      where: {
        businessId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        // Don't count CANCELLED events
        status: {
            not: "CANCELLED"
        }
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("CHECK_AVAILABILITY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
