import { NextRequest, NextResponse } from "next/server";

// specifiy the routes
const publicRoutes = ["/register", "/login"];
const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  // check the current user routes
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.includes(path);

  // dcrypt session from the cookie
  const session = request.cookies.get("session")?.value;
  // const payload = (await dcrypt(session!)) as SessionPayload;

  // redirect user to login if not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // redirect user to dashboard if authenticated
  if (
    isPublicRoute &&
    session &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
