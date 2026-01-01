// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "RANDA Auth",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        // FIXED: Return object harus LENGKAP sesuai definisi User di next-auth.d.ts
        // Error sebelumnya terjadi karena 'noWhatsapp' ketinggalan
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          noWhatsapp: user.noWhatsapp || "", // Tambahkan ini (Fallback ke string kosong jika null)
        };
      }
    })
  ],
  callbacks: {
    // 1. Saat Login sukses: Pindahkan data dari User ke Token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        // Opsional: Simpan noWhatsapp ke token juga jika perlu
        // token.noWhatsapp = user.noWhatsapp; 
      }
      return token;
    },
    
    // 2. Saat Frontend butuh sesi: Pindahkan data dari Token JWT ke Session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};