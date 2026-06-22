import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentBusinessId } from "@/lib/auth-helpers";
import { sendNotification } from "@/lib/notifications";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { status } = await req.json();

    const inquiry = await prisma.contactInquiry.update({
      where: { id, businessId },
      data: { status },
    });

    // Notify Customer if status changed to CONTACTED (Acknowledged)
    if (status === "CONTACTED") {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { name: true }
        });

        sendNotification({
            to: inquiry.phone,
            subject: "Inquiry Update",
            body: `Hello ${inquiry.name}, thank you for contacting ${business?.name || "us"}. We have received your inquiry and will get back to you shortly.`,
            type: "WHATSAPP",
            businessId,
            alertType: "SUCCESS"
        }).catch((err: unknown) => console.error("Failed to notify customer of inquiry update:", err));
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("UPDATE_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessId = await getCurrentBusinessId();

    if (!businessId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.contactInquiry.delete({
      where: { id, businessId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE_INQUIRY_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
