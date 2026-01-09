import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        events: true,
      },
    });

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("GET_CUSTOMER_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, email, phone, address } = await req.json();

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("UPDATE_CUSTOMER_ERROR", error);
    if (error.code === "P2002") {
      return new NextResponse("Email already exists", { status: 400 });
    }
    if (error.code === "P2025") {
      return new NextResponse("Customer not found", { status: 404 });
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
    await prisma.customer.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE_CUSTOMER_ERROR", error);
    if (error.code === "P2025") {
      return new NextResponse("Customer not found", { status: 404 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

