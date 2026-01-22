import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCurrentBusinessId() {
  const session = await auth();
  
  if (!session?.user?.email && !session?.user?.name) { 
    // Phone number is stored in name or email? Actually NextAuth might store phone in user object differently depending on config
    // Checking auth.ts, session.user has phone.
    // However, the best way is to fetch user by email or phone.
  }

  // Current session user should have phone, let's use that
  // But wait, the session object might not have phone if not added to session callback
  // Let's check auth.ts again.
  // It returns id, phone, email, name, role in session.user
  
  if (!session?.user) return null;

  // Ideally we should add businessId to the session to avoid DB call on every request
  // For now, let's fetch it from DB using the user ID from session
  
  if (session.user.id) {
     const user = await prisma.user.findUnique({
       where: { id: session.user.id },
       select: { businessId: true }
     });
     return user?.businessId || null;
  }
  
  return null;
}
