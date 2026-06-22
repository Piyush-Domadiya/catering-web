import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { phone, code, newPassword } = await req.json();

    if (!phone || !code || !newPassword) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    if (newPassword.length < 6) {
      return new NextResponse("Password must be at least 6 characters", {
        status: 400,
      });
    }

    // Verify OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        phone,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return new NextResponse("Invalid or expired OTP", { status: 400 });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
      },
    });

    // Delete used OTP
    await prisma.otp.deleteMany({
      where: { phone },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successful" 
    });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
