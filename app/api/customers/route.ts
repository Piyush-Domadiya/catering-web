import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      where: { businessId },
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
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
        businessId,
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("CREATE_CUSTOMER_ERROR", error);
    if (error.code === "P2002") {
      return new NextResponse("Email already exists in your business", { status: 400 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
