import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { notifyInquiryReceived } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Auto-update past events to COMPLETED
    // logic: if status is UPCOMING and date < today (00:00:00), mark as COMPLETED
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.event.updateMany({
      where: {
        businessId,
        status: "UPCOMING",
        date: {
          lt: today,
        },
      },
      data: {
        status: "COMPLETED",
      },
    });

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

    // Notify Admin if created by Customer (public/customer portal)
    // We don't await this to avoid blocking
    if (!status || status === "UPCOMING" || status === "QUOTATION") {
       const business = await prisma.business.findUnique({
           where: { id: businessId },
           select: { name: true }
       });
       
       // Re-using inquiry notification for now as generic "New Booking/Inquiry"
       notifyInquiryReceived(
           business?.name || "Catering Service",
           name + " (Event)", // Distinguish event from general inquiry
           "Customer Portal", // We might not have phone handy in this scope easily without fetching user, but usually valid
           businessId
       ).catch((err: unknown) => console.error("Failed to send event notification:", err));
    }

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("CREATE_EVENT_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
