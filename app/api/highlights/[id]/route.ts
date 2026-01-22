import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    const businessId = await getCurrentBusinessId();
    if (!session || session.user.role !== "ADMIN" || !businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.id) {
      return new NextResponse("Highlight ID is required", { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.highlight.findFirst({
        where: { id: params.id, businessId }
    });
    if (!existing) return new NextResponse("Highlight not found", { status: 404 });

    const highlight = await prisma.highlight.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(highlight);
  } catch (error) {
    console.error("[HIGHLIGHT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    const businessId = await getCurrentBusinessId();
    if (!session || session.user.role !== "ADMIN" || !businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { active } = body;

     // Verify ownership
    const existing = await prisma.highlight.findFirst({
        where: { id: params.id, businessId }
    });
    if (!existing) return new NextResponse("Highlight not found", { status: 404 });

    const highlight = await prisma.highlight.update({
      where: {
        id: params.id,
      },
      data: {
        active,
      },
    });

    return NextResponse.json(highlight);
  } catch (error) {
    console.error("[HIGHLIGHT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
