import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const images = await prisma.eventImage.findMany({
      where: {
        eventId: id,
        event: { businessId },
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("GET_EVENT_IMAGES_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { url, caption } = await req.json();

    if (!url) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    // Verify event ownership
    const event = await prisma.event.findFirst({
      where: { id, businessId },
    });
    if (!event) return new NextResponse("Event not found", { status: 404 });

    const image = await prisma.eventImage.create({
      data: {
        url,
        caption,
        eventId: id,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("ADD_EVENT_IMAGE_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return new NextResponse("Image ID is required", { status: 400 });
    }

    // Verify event ownership and image existence
    const image = await prisma.eventImage.findFirst({
      where: {
        id: imageId,
        eventId,
        event: { businessId },
      },
    });

    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    await prisma.eventImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("DELETE_EVENT_IMAGE_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
