import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCurrentBusinessId() {
  const session = await auth();

  if (!session?.user) return null;

  // Optimization: Return businessId from session if available to avoid DB call
  if (session.user.businessId) {
    return session.user.businessId;
  }
  
  // Fallback: Fetch from DB if not in session
  if (session.user.id) {
     const user = await prisma.user.findUnique({
       where: { id: session.user.id },
       select: { businessId: true }
     });
     return user?.businessId || null;
  }
  
  return null;
}
