import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register"];

function getSafeRedirectPath(path: string | null): string {
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (!isPublic && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (isPublic && token) {
    const next = getSafeRedirectPath(req.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(next, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// export function proxy() {
//   return null;
// }
