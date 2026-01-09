import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.id) {
      return new NextResponse("Highlight ID is required", { status: 400 });
    }

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
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { active } = body;

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
