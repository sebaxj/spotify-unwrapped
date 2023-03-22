import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // otherwise redirect to login
  if (pathname !== "/login" && !token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${pathname}&error=SessionRequired`, req.url)
    );
  }
}

// THESE ROUTES ARE INCLUDED FROM THE ABOVE LOGIC
// BUT ?! IS A NEGATIVE LOOKAHEAD SO THE ONES NAMED BELOW ARE EXCLUDED
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
