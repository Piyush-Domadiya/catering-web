import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
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
    const { name, date, time, location, type, customerId, status } =
      await req.json();

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(location && { location }),
        ...(type && { type }),
        ...(customerId && { customerId }),
        ...(status && { status }),
      },
      include: {
        customer: true,
      },
    });

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
