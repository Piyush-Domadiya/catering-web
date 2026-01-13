
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // First find the customer associated with this email
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email },
    });

    if (!customer) {
        // If no customer record exists for this user, return empty list
        return NextResponse.json({ events: [] });
    }

    const events = await prisma.event.findMany({
      where: { customerId: customer.id },
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
