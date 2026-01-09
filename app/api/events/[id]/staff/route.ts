import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const { staffId } = await req.json();

    if (!staffId) {
      return new NextResponse("Staff ID is required", { status: 400 });
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
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return new NextResponse("Staff ID is required", { status: 400 });
    }

    await prisma.eventStaff.deleteMany({
      where: {
        eventId: id,
        staffId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("REMOVE_STAFF_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
