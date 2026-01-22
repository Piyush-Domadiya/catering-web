import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const events = await prisma.event.findMany({
      where: {
        businessId,
        ...(customerId && { customerId }),
      },
      orderBy: { date: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        package: true,
        images: true,
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
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      name,
      date,
      time,
      location,
      type,
      customerId,
      packageId,
      status,
      guestCount,
      perPlateCost,
      taxRate,
      discount,
      menuItems,
      isQuote,
    } = await req.json();

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
        packageId,
        status: status || "UPCOMING",
        guestCount: guestCount ? parseInt(guestCount) : null,
        perPlateCost: perPlateCost ? parseFloat(perPlateCost) : null,
        taxRate: taxRate ? parseFloat(taxRate) : 0,
        discount: discount ? parseFloat(discount) : 0,
        menuItems,
        isQuote: !!isQuote,
        businessId,
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
