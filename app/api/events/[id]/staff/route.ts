import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

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

    // Verify event ownership
    const event = await prisma.event.findFirst({
        where: { id, businessId }
    });
    if (!event) return new NextResponse("Event not found", { status: 404 });

    const assignments = await prisma.eventStaff.findMany({
      where: { eventId: id },
      include: {
        staff: true,
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("GET_EVENT_STAFF_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { staffId } = await req.json();

    if (!staffId) {
      return new NextResponse("Staff ID is required", { status: 400 });
    }

    // Verify event ownership
    const event = await prisma.event.findFirst({
        where: { id, businessId }
    });
    if (!event) return new NextResponse("Event not found", { status: 404 });

    // Verify staff ownership
    const staff = await prisma.staff.findFirst({
        where: { id: staffId, businessId }
    });
    if (!staff) return new NextResponse("Staff not found", { status: 404 });

    // Check for conflicts: Is the staff assigned to another event on the same day?
    const eventDate = new Date(event.date);
    const startOfDay = new Date(eventDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(eventDate.setHours(23, 59, 59, 999));

    const conflict = await prisma.eventStaff.findFirst({
      where: {
        staffId,
        event: {
          id: { not: id },
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: { not: "CANCELLED" }
        },
      },
      include: {
        event: true
      }
    });

    if (conflict) {
      return new NextResponse(`Conflict: ${staff.name} is already assigned to "${conflict.event.name}" on this date.`, {
        status: 409, // Conflict
      });
    }

    const assignment = await prisma.eventStaff.create({
      data: {
        eventId: id,
        staffId,
      },
      include: {
        staff: true,
      },
    });

    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error("ASSIGN_STAFF_ERROR", error);
    if (error.code === "P2002") {
      return new NextResponse("Staff already assigned to this event", {
        status: 400,
      });
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

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return new NextResponse("Staff ID is required", { status: 400 });
    }
    
    // Verify event ownership
    const event = await prisma.event.findFirst({
        where: { id, businessId }
    });
    if (!event) return new NextResponse("Event not found", { status: 404 });

    await prisma.eventStaff.deleteMany({
      where: {
        eventId: id,
        staffId,
      },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.error("REMOVE_STAFF_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
