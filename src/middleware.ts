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

export default clerkMiddleware(async (auth, req) => {
    const pathname = req.nextUrl.pathname;

    // Skip Clerk entirely for static routes
    if (isStaticRoute(pathname)) {
        return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    const response = handleI18nRouting(req);

    // Add minimal SEO headers for performance
    if (response) {
        const locale = pathname.startsWith("/en") ? "en" : "fr";
        response.headers.set("Content-Language", locale);
    }

    return response;
});

export const config = {
    matcher: ["/((?!_next/static|_next/image).*)", "/"],
};
