import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("TESTIMONIALS_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, role, content, rating } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        content,
        rating: parseInt(rating),
        businessId,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("TESTIMONIALS_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
