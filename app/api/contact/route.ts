import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { notifyInquiryReceived } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      eventType,
      guestCount,
      eventDate,
      venueLocation,
      message,
      businessId, // Optional in body, fallback to default if not provided
    } = body;

    if (!name || !phone || !eventType) {
      return new NextResponse("Name, phone, and event type are required", {
        status: 400,
      });
    }

    // Determine target business
    let targetBusinessId = businessId;
    if (!targetBusinessId) {
         // Fallback: If logged in, use user's business. 
         // If public/anonymous, pick first business (Demo) for now.
         const userBusinessId = await getCurrentBusinessId();
         if (userBusinessId) {
             targetBusinessId = userBusinessId;
         } else {
             const defaultBusiness = await prisma.business.findFirst();
             targetBusinessId = defaultBusiness?.id;
         }
    }

    if (!targetBusinessId) {
        return new NextResponse("Business ID required", { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        eventType,
        guestCount: guestCount ? parseInt(guestCount) : null,
        eventDate,
        venueLocation,
        message,
        status: "NEW",
        businessId: targetBusinessId
      },
    });

    // Notify Admin
    // We don't await this to avoid blocking the response
    const business = await prisma.business.findUnique({
        where: { id: targetBusinessId },
        select: { name: true }
    });

    notifyInquiryReceived(
        business?.name || "Catering Service",
        name,
        phone,
        targetBusinessId
    ).catch((err: unknown) => console.error("Failed to send inquiry notification:", err));

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("CREATE_CONTACT_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const inquiries = await prisma.contactInquiry.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("GET_CONTACT_INQUIRIES_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
