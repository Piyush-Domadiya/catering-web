"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.phone) {
    return { error: "Unauthorized" };
  }

  const businessId = (session.user.businessId as string) || undefined;
  const userId = (session.user.id as string) || undefined;

  const nameRaw = formData.get("name");
  const passwordRaw = formData.get("password");
  const confirmPasswordRaw = formData.get("confirmPassword");

  if (typeof nameRaw !== "string" || !nameRaw.trim()) {
    return { error: "Name is required" };
  }
  const name = nameRaw.trim();

  const password = typeof passwordRaw === "string" && passwordRaw ? passwordRaw : "";
  const confirmPassword = typeof confirmPasswordRaw === "string" ? confirmPasswordRaw : "";

  const updateUserData: { name?: string; password?: string } = { name };

  if (password) {
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }
    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }
    updateUserData.password = await hash(password, 12);
  }

  try {
    // Prepare updates: update User (by id when available, else by phone), and update Customer(s) scoped by businessId.
    const userWhere = userId ? { id: userId } : { phone: session.user.phone };

    const customerWhere: any = { phone: session.user.phone };
    if (businessId) customerWhere.businessId = businessId;

    await prisma.$transaction([
      prisma.user.update({ where: userWhere, data: updateUserData }),
      prisma.customer.updateMany({ where: customerWhere, data: { name } }),
    ]);

    revalidatePath("/my-events/profile");
    return { success: "Profile updated successfully", name };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}
