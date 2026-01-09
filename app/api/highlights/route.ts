import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
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
      },
    });

    return NextResponse.json(highlight);
  } catch (error) {
    console.error("[HIGHLIGHTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const highlights = await prisma.highlight.findMany({
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
