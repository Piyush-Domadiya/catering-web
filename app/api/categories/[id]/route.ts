import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const category = await prisma.menuCategory.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("UPDATE_CATEGORY_ERROR", error);
    if (error.code === "P2002") {
      return new NextResponse("Category name already exists", { status: 400 });
    }
    if (error.code === "P2025") {
      return new NextResponse("Category not found", { status: 404 });
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

    // Check if category has items
    const category = await prisma.menuCategory.findUnique({
      where: { id },
      include: { _count: { select: { items: true } } },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category._count.items > 0) {
      return new NextResponse(
        "Cannot delete category with items. Please reassign or delete items first.",
        { status: 400 }
      );
    }

    await prisma.menuCategory.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE_CATEGORY_ERROR", error);
    if (error.code === "P2025") {
      return new NextResponse("Category not found", { status: 404 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
