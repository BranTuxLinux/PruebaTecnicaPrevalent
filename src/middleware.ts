import NextAuth from "next-auth"
import { NextResponse } from "next/server";
import authConfig from "./auth.config"
 
const { auth: middleware } = NextAuth(authConfig)
const publicRoutes = ["/", "/login", "/register"];
const startsRoutes = ['/api/auth/callback/google', "/api/"]
export default middleware((req) => {
  const { nextUrl, auth } = req;
  
  return NextResponse.next();
});

export const config = {
    matcher: [
      "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      "/(api|trpc)(.*)",
    ],
  };
                                    