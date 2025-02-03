import type { NextAuthConfig } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import { prisma } from "./lib/prisma";
import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER,
  NEXTAUTH_SECRET,
} from "./lib/config";
export default {
  trustHost: true,
  providers: [
    Auth0({
      clientId: AUTH0_CLIENT_ID!,
      clientSecret: AUTH0_CLIENT_SECRET!,
      issuer: AUTH0_ISSUER!,
      authorization: { params: { prompt: "login" } },
      allowDangerousEmailAccountLinking: true,
      redirectProxyUrl: "",
      checks: ["state"],
    }),
  ],

  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth }) => !!auth,
    async signIn({ account, profile }) {
      if (account?.provider === "auth0") {
        const id = account.providerAccountId;
        await prisma.$connect();

        // ? Creación antes del adapter debido a que presenta problemas 
        const existingUser = await prisma.user.findUnique({
          where: {
            id,
          },
        });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: profile?.name,
              email: profile?.email,
              image: profile?.picture,
              emailVerified: null,
              id: id,
            },
          });
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
