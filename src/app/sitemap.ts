import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://gossip.vercel.app";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
            alternates: {
                languages: {
                    en: `${baseUrl}/en`,
                    fr: `${baseUrl}/fr`,
                },
            },
        },
        {
            url: `${baseUrl}/en`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/fr`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/en/dashboard`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/fr/dashboard`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/en/submit`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/fr/submit`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        // Note: Dynamic story and event pages would be added here
        // when you have a database of content to iterate through
    ];
}
