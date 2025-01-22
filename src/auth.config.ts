import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
} satisfies NextAuthConfig;
