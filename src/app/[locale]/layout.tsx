import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { BookOpenTextIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://gossip.vercel.app"),
    title: {
        default: "Gossip - Share Stories, Connect Communities",
        template: "%s | Gossip",
    },
    description:
        "Gossip is a modern storytelling platform where communities come together to share experiences, connect with others, and discover amazing stories from around the world.",
    keywords: [
        "gossip",
        "stories",
        "community",
        "storytelling",
        "social",
        "sharing",
        "connect",
        "experiences",
        "events",
        "conversations",
    ],
    authors: [
        {
            name: "cavdar.fr",
            url: "https://cavdar.fr",
        },
    ],
    creator: "cavdar.fr",
    publisher: "cavdar.fr",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        title: "Gossip - Share Stories, Connect Communities",
        description:
            "Gossip is a modern storytelling platform where communities come together to share experiences, connect with others, and discover amazing stories from around the world.",
        url: "https://gossip.vercel.app",
        siteName: "Gossip",
        locale: "en_US",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Gossip - Share Stories, Connect Communities",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Gossip - Share Stories, Connect Communities",
        description:
            "Gossip is a modern storytelling platform where communities come together to share experiences, connect with others, and discover amazing stories from around the world.",
        creator: "@cavdar_fr",
        images: [
            {
                url: "/og-image.png",
                alt: "Gossip - Share Stories, Connect Communities",
            },
        ],
    },
    category: "social",
    alternates: {
        canonical: "https://gossip.vercel.app",
        languages: {
            "en-US": "https://gossip.vercel.app/en",
            "fr-FR": "https://gossip.vercel.app/fr",
        },
    },
    verification: {
        google: undefined, // Add Google Search Console verification meta tag here when available
        // yandex: undefined, // Add Yandex verification if needed
        // yahoo: undefined, // Add Yahoo verification if needed
    },
    other: {
        "theme-color": "#3b82f6",
        "color-scheme": "light",
    },
};

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const t = await getTranslations("common");

    return (
        <ClerkProvider>
            <html lang={locale}>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
                >
                    <NextIntlClientProvider messages={messages}>
                        <header className="border-b border-gray-200 bg-white shadow-sm">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center h-16">
                                    <div className="flex items-center space-x-8">
                                        <Link
                                            href="/"
                                            className="text-xl font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2"
                                        >
                                            <BookOpenTextIcon className="w-6 h-6" />{" "}
                                            {t("appName")}
                                        </Link>
                                        <SignedIn>
                                            <nav className="flex space-x-4">
                                                <Link
                                                    href="/dashboard"
                                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    {t("dashboard")}
                                                </Link>
                                            </nav>
                                        </SignedIn>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {/* Language Switcher */}
                                        <LanguageSwitcher
                                            currentLocale={locale}
                                        />
                                        <SignedOut>
                                            <SignInButton mode="modal">
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                                    {t("signIn")}
                                                </button>
                                            </SignInButton>
                                            <SignUpButton mode="modal">
                                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                                    {t("signUp")}
                                                </button>
                                            </SignUpButton>
                                        </SignedOut>
                                        <SignedIn>
                                            <UserButton
                                                appearance={{
                                                    elements: {
                                                        avatarBox: "h-8 w-8",
                                                    },
                                                }}
                                            />
                                        </SignedIn>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </NextIntlClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
