import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const businessId = await getCurrentBusinessId();

    if (!session || session.user.role !== "ADMIN" || !businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, imageUrl } = body;

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    const highlight = await prisma.highlight.create({
      data: {
        title,
        imageUrl,
        businessId
      },
    });

    return NextResponse.json(highlight);
  } catch (error) {
    console.error("[HIGHLIGHTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(_req: Request) {
  try {
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
         // Optionally return empty or Unauthorized. 
         // For public parts, we might need a way to know business.
         // Assuming ADMIN use for now or authenticated context.
         // If unauthenticated, we can't show highlights unless we know which business.
         return new NextResponse("Unauthorized", { status: 401 });
    }
    const highlights = await prisma.highlight.findMany({
      where: { businessId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(highlights);
  } catch (error) {
    console.error("[HIGHLIGHTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
