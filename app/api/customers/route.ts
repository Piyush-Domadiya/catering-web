import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET_CUSTOMERS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, address } = await req.json();

    if (!name || !phone) {
      return new NextResponse("Name and phone are required", { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("CREATE_CUSTOMER_ERROR", error);
    if (error.code === "P2002") {
      return new NextResponse("Email already exists", { status: 400 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
