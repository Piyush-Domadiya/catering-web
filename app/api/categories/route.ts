import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const category = await prisma.menuCategory.create({
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("CREATE_CATEGORY_ERROR", error);
    if (error.code === "P2002") {
      return new NextResponse("Category already exists", { status: 400 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
