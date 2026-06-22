import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify ownership before deleting
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!testimonial || testimonial.businessId !== businessId) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("TESTIMONIAL_DELETE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
