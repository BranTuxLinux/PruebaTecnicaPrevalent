//@ts-ignore
import type { NextAuthConfig } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./lib/prisma";

export default {
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
      authorization: { params: { prompt: "login" } },
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "auth0") {
        console.table({
          provider: account.providerAccountId,
          profile: profile?.sub,
          id: profile?.id,
          idAccount: account.userId,
        });
        const id = account.providerAccountId;
        const existingUser = await prisma.user.findUnique({
          where: {
            id,
          },
        });
        if (!existingUser){
          await prisma.user.create({
            data: {
              name: profile?.name,
              email: profile?.email,
              image: profile?.picture,
              emailVerified: null,
              id: id
            }
          })
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
