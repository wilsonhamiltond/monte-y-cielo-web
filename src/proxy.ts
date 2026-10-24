import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Saved choice first, then the browser's Accept-Language, then Spanish. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  for (const entry of header.split(",")) {
    const code = entry.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // A localized URL: remember the language the visitor chose.
  if (isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Admin, API, uploaded photos, Next internals and static files are not localized.
  matcher: ["/((?!_next|api|admin|uploads|.*\\..*).*)"],
};
