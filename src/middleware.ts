import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
    "/:locale/dashboard(.*)",
    "/dashboard(.*)",
    "/api/events(.*)",
    "/api/stories(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    return handleI18nRouting(req);
});

export const config = {
    matcher: [
        // Match all routes except static files, Next.js internals, icon routes, and manifest
        "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|icon-192|icon-512|opengraph-image|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
