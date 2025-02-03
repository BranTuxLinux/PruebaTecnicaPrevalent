import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig);
//Routes
const publicRoutes = ["/", "/login", "/register"];
const adminRoutes = ["/admin", "/users", "/reports"];
const apiAdminEndpoints = ["/api/users", "/api/transactions"];
const startsRoutes = ["/api/auth/callback/", "/api/"];

export default middleware(async (req) => {
  const { nextUrl, auth } = req;
  //Role definition
  const isLoggedIn = !!auth?.user;
  const isAdmin = auth?.user?.role === "ADMIN";
  // Permission of routes
  const isAuthRoute = startsRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isApiAdminEndpoint = apiAdminEndpoints.some((endpoint) =>
    nextUrl.pathname.startsWith(endpoint)
  );

  if (isAuthRoute) return NextResponse.next();
  if (isPublicRoute) return NextResponse.next();
  if (!isLoggedIn) return NextResponse.redirect(new URL("/", nextUrl.origin));
  if (isAdminRoute && !isAdmin)
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  if (isApiAdminEndpoint && !isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
