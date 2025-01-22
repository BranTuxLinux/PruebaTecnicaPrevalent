import NextAuth from "next-auth"
import authConfig from "./auth.config"
 
export const { auth: middleware } = NextAuth(authConfig)

const publicRoutes = ["/", "/login", "/register"];
const startsRoutes = ['/api/auth/callback/google', "/api/"]
export default middleware((req) => {
  const { nextUrl, auth } = req;
  console.log({auth})
  const isLoggedIn = !!auth?.user;
  
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)

  const isStartsRoutes = startsRoutes.some(prefix =>
    nextUrl.pathname.startsWith(prefix)
  )
});

export const config = {
    matcher: [
      "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      "/(api|trpc)(.*)",
    ],
  };
                                    