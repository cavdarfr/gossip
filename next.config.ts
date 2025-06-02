import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    /* SEO and Performance Optimizations */

    // Enable compression for better performance
    compress: true,

    // Generate static pages for better SEO
    output: "standalone",

    // Image optimization for better loading
    images: {
        formats: ["image/webp", "image/avif"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Experimental features for better SEO
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },

    // Headers for security and SEO
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                ],
            },
            {
                source: "/sitemap.xml",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/xml",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=43200",
                    },
                ],
            },
            {
                source: "/robots.txt",
                headers: [
                    {
                        key: "Content-Type",
                        value: "text/plain",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=43200",
                    },
                ],
            },
        ];
    },

    // Redirects for SEO
    async redirects() {
        return [
            {
                source: "/home",
                destination: "/",
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
