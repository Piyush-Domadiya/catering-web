
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { auth } from "@/auth";

export async function GET() {
  try {
     const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await prisma.globalSettings.upsert({
      where: { businessId },
      update: {},
      create: {
        businessId,
        companyName: "Tasteful Affaire", // Default name, should probably be dynamic based on business name
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("SETTINGS_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    const businessId = await getCurrentBusinessId();

    if (!user || user.role !== "ADMIN" || !businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const settings = await prisma.globalSettings.upsert({
      where: { businessId },
      update: body,
      create: {
        businessId,
        ...body,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("SETTINGS_UPDATE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
