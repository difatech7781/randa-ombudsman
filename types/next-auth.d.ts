import { UserRole } from "@prisma/client" // Import Enum dari Prisma
import NextAuth, { DefaultSession } from "next-auth"

// Kita "suntik" properti role ke dalam tipe Session bawaan NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole // <-- Sekarang TypeScript tau user punya role!
      noWhatsapp: string
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    noWhatsapp: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    id: string
  }
}