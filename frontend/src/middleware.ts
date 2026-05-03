import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const allCookies = request.cookies.getAll();
    console.log("All Cookies available to Middleware:", allCookies);

    const token = request.cookies.get("token")?.value;
    console.log("Extracted Token:", token ? "Exists" : "MISSING");

    const isLoginPage = request.nextUrl.pathname == "/login";
    const isRegisterPage = request.nextUrl.pathname == "/register";
    const isRootPage = request.nextUrl.pathname == "/";

    if (!token && (isRootPage || request.nextUrl.pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && (isLoginPage || isRegisterPage)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};