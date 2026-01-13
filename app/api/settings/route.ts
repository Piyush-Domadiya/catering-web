
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const settings = await prisma.globalSettings.upsert({
      where: { id: "settings" },
      update: {},
      create: {
        id: "settings",
        companyName: "Testful Affaire",
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

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const settings = await prisma.globalSettings.upsert({
      where: { id: "settings" },
      update: body,
      create: {
        id: "settings",
        ...body,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("SETTINGS_UPDATE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
