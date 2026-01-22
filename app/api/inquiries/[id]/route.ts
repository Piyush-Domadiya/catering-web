import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { status } = await req.json();

    const inquiry = await prisma.contactInquiry.update({
      where: { id, businessId },
      data: { status },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("UPDATE_INQUIRY_ERROR", error);
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

    await prisma.contactInquiry.delete({
      where: { id, businessId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
