
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const session = await auth();
    const businessId = await getCurrentBusinessId();

    if (!session?.user?.email || !businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // First find the customer associated with this email
    const customer = await prisma.customer.findFirst({
      where: { 
        email: session.user.email,
        businessId
      },
    });

    if (!customer) {
        // If no customer record exists for this user, return empty list
        return NextResponse.json({ events: [] });
    }

    const events = await prisma.event.findMany({
      where: { customerId: customer.id, businessId },
      orderBy: { date: "desc" },
      select: {
        id: true,
        name: true,
        date: true,
        time: true,
        location: true,
        status: true,
        type: true,
      }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("USER_EVENTS_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
