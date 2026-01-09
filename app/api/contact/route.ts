import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      eventType,
      guestCount,
      eventDate,
      venueLocation,
      message,
    } = await req.json();

    if (!name || !email || !eventType) {
      return new NextResponse("Name, email, and event type are required", {
        status: 400,
      });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        eventType,
        guestCount: guestCount ? parseInt(guestCount) : null,
        eventDate,
        venueLocation,
        message,
        status: "NEW",
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("CREATE_CONTACT_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("GET_CONTACT_INQUIRIES_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
