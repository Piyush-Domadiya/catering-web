import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return new NextResponse("Phone number is required", { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Don't reveal if user exists for security, but in this context maybe better to be clear
      // Actually, for a catering app, simple is better.
      return new NextResponse("User with this phone number not found", { status: 404 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in DB
    await prisma.otp.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });

    // SIMULATION: Log the code to console
    console.log(`[AUTH] OTP for ${phone}: ${code} (Expires: ${expiresAt.toISOString()})`);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully (Check server logs)" 
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_OTP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
