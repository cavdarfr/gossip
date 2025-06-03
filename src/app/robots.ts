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
        ],
        sitemap: "https://gossip.cavdar.fr/sitemap.xml",
        host: "https://gossip.cavdar.fr",
    };
}
