import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
    "/:locale/dashboard(.*)",
    "/dashboard(.*)",
    "/:locale/story/:id/review(.*)",
    "/story/:id/review(.*)",
    "/api/events(.*)",
    "/api/stories(.*)",
]);

// Static routes that should bypass Clerk entirely
const isStaticRoute = (pathname: string) => {
    const staticPaths = [
        "/favicon.ico",
        "/icon",
        "/apple-icon",
        "/icon-192",
        "/icon-512",
        "/manifest.webmanifest",
        "/robots.txt",
        "/sitemap.xml",
        "/opengraph-image",
        "/favicon.svg",
    ];

    return (
        pathname.startsWith("/_next") ||
        staticPaths.includes(pathname) ||
        pathname.match(
            /\.(ico|png|jpg|jpeg|svg|gif|webp|js|css|woff|woff2|ttf)$/
        )
    );
};

// Check if the path is a localized static route that should be redirected to root
const isLocalizedStaticRoute = (pathname: string) => {
    const staticPaths = [
        "favicon.ico",
        "icon",
        "apple-icon",
        "icon-192",
        "icon-512",
        "manifest.webmanifest",
        "robots.txt",
        "sitemap.xml",
        "opengraph-image",
        "favicon.svg",
    ];

    // Check if pathname matches /{locale}/{staticPath}
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length === 2) {
        const [locale, staticPath] = pathParts;
        if (["en", "fr"].includes(locale) && staticPaths.includes(staticPath)) {
            return staticPath;
        }
    }

    return null;
};

export default clerkMiddleware(async (auth, req) => {
    const pathname = req.nextUrl.pathname;

    // Check for localized static routes and redirect to root
    const staticPath = isLocalizedStaticRoute(pathname);
    if (staticPath) {
        const url = req.nextUrl.clone();
        url.pathname = `/${staticPath}`;
        return NextResponse.redirect(url);
    }

    // Skip Clerk entirely for static routes
    if (isStaticRoute(pathname)) {
        return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    return handleI18nRouting(req);
});

export const config = {
    // Match all routes
    matcher: ["/((?!_next/static|_next/image).*)", "/"],
};
