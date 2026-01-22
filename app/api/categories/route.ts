import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET() {
  try {
     const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await prisma.menuCategory.findMany({
      where: { businessId },
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
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const category = await prisma.menuCategory.create({
      data: { 
        name,
        businessId
      },
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
