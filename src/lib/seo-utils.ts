import type { Metadata } from "next";

interface SEOConfig {
    title: string;
    description: string;
    locale: string;
    path?: string;
    keywords?: string[];
    type?: "website" | "article";
}

export function generateSEO({
    title,
    description,
    locale,
    path = "",
    keywords = [],
    type = "website",
}: SEOConfig): Metadata {
    const baseUrl = "https://gossip.cavdar.fr";
    const isFrench = locale === "fr";
    const url = isFrench ? `${baseUrl}${path}` : `${baseUrl}/en${path}`;

    const defaultKeywords = isFrench
        ? ["gossip", "histoires", "communauté", "france"]
        : ["gossip", "stories", "community", "france"];

    return {
        metadataBase: new URL(baseUrl),
        title,
        description,
        keywords: [...defaultKeywords, ...keywords],
        openGraph: {
            type,
            title,
            description,
            url,
            locale: isFrench ? "fr_FR" : "en_US",
        },
        alternates: {
            canonical: url,
            languages: {
                "fr-FR": path ? `${baseUrl}${path}` : baseUrl,
                "en-US": path ? `${baseUrl}/en${path}` : `${baseUrl}/en`,
                "x-default": path ? `${baseUrl}${path}` : baseUrl,
            },
        },
        other: {
            ...(isFrench && { "geo.region": "FR" }),
            "content-language": locale,
        },
    };
}

// Simple sitemap helper
export function generateSitemapEntry(path: string, priority = 0.8) {
    const baseUrl = "https://gossip.cavdar.fr";

    return [
        {
            url: path === "/" ? baseUrl : `${baseUrl}${path}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: path === "/" ? 1 : priority,
        },
        {
            url: path === "/" ? `${baseUrl}/en` : `${baseUrl}/en${path}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: path === "/" ? 0.8 : priority - 0.2,
        },
    ];
}
