import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifyInquiryReceived } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { name, phone, email, eventType, guestCount, eventDate, items, totalCost, businessId: initialBusinessId } = await req.json();

    if (!name || !phone) {
      return new NextResponse("Missing name or phone", { status: 400 });
    }

    // Determine target business
    let businessId = initialBusinessId;
    if (!businessId) {
        const defaultBusiness = await prisma.business.findFirst();
        businessId = defaultBusiness?.id;
    }

    if (!businessId) {
        return new NextResponse("Business ID required", { status: 400 });
    }

    // Verify business exists
    const business = await prisma.business.findUnique({
        where: { id: businessId }
    });

    if (!business) {
        // Fallback to first business if provided ID is invalid
        const fallbackBusiness = await prisma.business.findFirst();
        if (!fallbackBusiness) {
            return new NextResponse("Business not found", { status: 400 });
        }
        businessId = fallbackBusiness.id;
    }

    // Create inquiry
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        phone,
        email: email || "",
        eventType: eventType || "Custom Menu",
        guestCount: parseInt(guestCount) || 0,
        eventDate: eventDate || "",
        message: `Plan Menu Selection:\n${items.join("\n")}\n\nTotal Estimated Price: ₹${totalCost}`,
        businessId,
      },
    });

    // Find business owner (admin) for this business
    const admin = await prisma.user.findFirst({
      where: { businessId, role: "ADMIN" }
    });

    // Notify admin (async)
    notifyInquiryReceived(business?.name || "Tasteful Affaire", name, phone, businessId, admin?.id).catch(console.error);

    return NextResponse.json(inquiry);
  } catch (error: any) {
    console.error("CREATE_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
