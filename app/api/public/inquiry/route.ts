import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifyInquiryReceived } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { name, phone, email, eventType, guestCount, eventDate, items, totalCost, businessId } = await req.json();

    if (!name || !phone || !businessId) {
      return new NextResponse("Missing required fields", { status: 400 });
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
    notifyInquiryReceived("Testful Affaire", name, phone, businessId, admin?.id).catch(console.error);

    return NextResponse.json(inquiry);
  } catch (error: any) {
    console.error("CREATE_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
