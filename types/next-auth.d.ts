import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      businessId: string
      phone?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    phone?: string
    role?: string
    businessId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    phone?: string
    businessId?: string
  }
}
