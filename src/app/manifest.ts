import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Gossip - Share Stories, Connect Communities",
        short_name: "Gossip",
        description:
            "Gossip is a modern storytelling platform where communities come together to share experiences, connect with others, and discover amazing stories from around the world.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        categories: ["social", "lifestyle", "entertainment"],
        lang: "en",
        scope: "/",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon-192",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-512",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-192",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon-512",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
        screenshots: [
            {
                src: "/screenshot-wide.png",
                sizes: "1024x768",
                type: "image/png",
                form_factor: "wide",
            },
            {
                src: "/screenshot-narrow.png",
                sizes: "375x812",
                type: "image/png",
                form_factor: "narrow",
            },
        ],
    };
}
