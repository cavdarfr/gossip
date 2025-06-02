import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/_next/",
                    "/admin/",
                    "/private/",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/_next/",
                    "/admin/",
                    "/private/",
                ],
            },
        ],
        sitemap: "https://gossip.vercel.app/sitemap.xml",
        host: "https://gossip.vercel.app",
    };
}
