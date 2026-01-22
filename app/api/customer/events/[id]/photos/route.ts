import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.phone) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify event belongs to the customer
    const event = await prisma.event.findFirst({
      where: {
        id,
        customer: {
          phone: session.user.phone,
        },
      },
      include: {
        images: true,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET_CUSTOMER_EVENT_PHOTOS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
