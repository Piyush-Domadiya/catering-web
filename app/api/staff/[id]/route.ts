import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!staff) {
      return new NextResponse("Staff member not found", { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error("GET_STAFF_MEMBER_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, role, phone } = await req.json();

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(phone && { phone }),
      },
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error("UPDATE_STAFF_ERROR", error);
    if (error.code === "P2025") {
      return new NextResponse("Staff member not found", { status: 404 });
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
    await prisma.staff.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE_STAFF_ERROR", error);
    if (error.code === "P2025") {
      return new NextResponse("Staff member not found", { status: 404 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
