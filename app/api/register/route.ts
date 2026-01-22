import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, password, name } = await req.json();

    if (!phone || !password || !name) {
      return new NextResponse("Missing required fields (phone, password, name)", { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return new NextResponse("Invalid phone number. Must be 10 digits starting with 6-9", { status: 400 });
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return new NextResponse("Phone number already registered", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Find the default Business (Assumption: First business found is the main one)
    // In a real multi-tenant app, we might want a specific logic here, but for now this works.
    const defaultBusiness = await prisma.business.findFirst();

    if (!defaultBusiness) {
        return new NextResponse("System Error: No Business Registered to accept customers.", { status: 500 });
    }

    // Transaction to ensure all related data is created or nothing is
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Create the Consumer User (Login Credentials)
      const user = await tx.user.create({
        data: {
          phone,
          name,
          password: hashedPassword,
          role: "CUSTOMER", // Enforce Customer Role
          businessId: defaultBusiness.id,
        },
      });

      // 2. Create the Customer Profile (For Business Records)
      const customer = await tx.customer.create({
        data: {
          name,
          phone,
          businessId: defaultBusiness.id,
          // We don't have email/address in the simple form yet, can be added later
        }
      });

      return { user, customer };
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        phone: result.user.phone,
        role: result.user.role,
      },
      message: "Account created successfully"
    });

  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
