import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { sendNotification } from "@/lib/notifications";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await prisma.event.findFirst({
      where: { id, businessId },
      include: {
        customer: true,
        staff: {
          include: {
            staff: true,
          },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET_EVENT_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify ownership before update
    const existingEvent = await prisma.event.findFirst({
        where: { id, businessId }
    });

    if (!existingEvent) {
        return new NextResponse("Event not found", { status: 404 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(date && { date: new Date(date) }),
        ...(time !== undefined && { time }),
        ...(location && { location }),
        ...(type && { type }),
        ...(customerId && { customerId }),
        ...(packageId !== undefined && { packageId }),
        ...(status && { status }),
        ...(guestCount !== undefined && { guestCount: guestCount ? parseInt(guestCount) : null }),
        ...(perPlateCost !== undefined && { perPlateCost: perPlateCost ? parseFloat(perPlateCost) : null }),
        ...(taxRate !== undefined && { taxRate: taxRate ? parseFloat(taxRate) : 0 }),
        ...(discount !== undefined && { discount: discount ? parseFloat(discount) : 0 }),
        ...(menuItems !== undefined && { menuItems }),
        ...(isQuote !== undefined && { isQuote: !!isQuote }),
      },
      include: {
        customer: true,
      },
    });

    // Notify Customer on significant status change
    if (status && status !== existingEvent.status) {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { name: true }
        });

        const customer = await prisma.customer.findUnique({
            where: { id: existingEvent.customerId },
            select: { name: true, phone: true }
        });

        if (customer) {
            let msgBody = `Hello ${customer.name}, the status of your event "${existingEvent.name}" has been updated to ${status}.`;
            if (status === "QUOTATION") msgBody = `Hello ${customer.name}, a quotation has been prepared for your event "${existingEvent.name}". Please check your dashboard.`;
            if (status === "CONFIRMED" || status === "UPCOMING") msgBody = `Hello ${customer.name}, your event "${existingEvent.name}" is now confirmed!`;

           sendNotification({
                to: customer.phone,
                subject: "Event Update",
                body: msgBody,
                type: "WHATSAPP",
                businessId,
                alertType: "INFO"
            }).catch((err: unknown) => console.error("Failed to notify customer of event update:", err));
        }
    }

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("UPDATE_EVENT_ERROR", error);
    if (error.code === "P2025") {
      return new NextResponse("Event not found", { status: 404 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
       return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify ownership
    const existingEvent = await prisma.event.findFirst({
        where: { id, businessId }
    });

    if (!existingEvent) {
        return new NextResponse("Event not found", { status: 404 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE_EVENT_ERROR", error);
    if (error.code === "P2025") {
      return new NextResponse("Event not found", { status: 404 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
