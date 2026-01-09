import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("GET_STAFF_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, role, phone } = await req.json();

    if (!name || !role || !phone) {
      return new NextResponse("Name, role, and phone are required", {
        status: 400,
      });
    }

    const staffMember = await prisma.staff.create({
      data: {
        name,
        role,
        phone,
      },
    });

    return NextResponse.json(staffMember);
  } catch (error: any) {
    console.error("CREATE_STAFF_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
