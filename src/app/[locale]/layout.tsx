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
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import "../globals.css";
import { PlausibleAnalytics } from "@/components/analytics";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

type LocaleParams = {
    locale: string;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<LocaleParams>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });

    const isFrench = locale === "fr";
    const baseUrl = "https://gossip.cavdar.fr";
    const canonicalUrl = isFrench ? baseUrl : `${baseUrl}/en`;

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: t("title"),
            template: `%s | ${t("appName")}`,
        },
        description: t("description"),
        keywords: isFrench
            ? [
                  "gossip",
                  "histoires",
                  "récits",
                  "communauté",
                  "narration",
                  "partage",
                  "événements",
                  "témoignages",
                  "france",
                  "francophone",
              ]
            : [
                  "gossip",
                  "stories",
                  "community",
                  "storytelling",
                  "sharing",
                  "events",
                  "testimonials",
                  "france",
                  "french",
              ],
        openGraph: {
            type: "website",
            title: t("title"),
            description: t("description"),
            url: canonicalUrl,
            siteName: t("appName"),
            locale: isFrench ? "fr_FR" : "en_US",
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: t("title"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            creator: "@cavdar_fr",
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                "fr-FR": baseUrl,
                "en-US": `${baseUrl}/en`,
                "x-default": baseUrl,
            },
        },
        other: {
            ...(isFrench && {
                "geo.region": "FR",
                "geo.country": "France",
            }),
            "content-language": locale,
        },
    };
}

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();
    const t = await getTranslations("common");

    return (
        <ClerkProvider>
            <html lang={locale}>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
                >
                    <NextIntlClientProvider messages={messages}>
                        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center h-20">
                                    <div className="flex items-center space-x-8">
                                        <Link
                                            href="/"
                                            className="text-2xl font-bold text-gray-900 whitespace-nowrap flex items-center gap-3 hover:opacity-80 transition-opacity"
                                        >
                                            {t("appName")}
                                        </Link>
                                        <SignedIn>
                                            <nav className="hidden md:flex space-x-1">
                                                <Link
                                                    href="/dashboard"
                                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                                >
                                                    {t("dashboard")}
                                                </Link>
                                            </nav>
                                        </SignedIn>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <LanguageSwitcher
                                            currentLocale={locale}
                                        />
                                        <SignedOut>
                                            <div className="flex items-center space-x-2">
                                                <SignInButton mode="modal">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        {t("signIn")}
                                                    </Button>
                                                </SignInButton>
                                                <SignUpButton mode="modal">
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                                                    >
                                                        {t("signUp")}
                                                    </Button>
                                                </SignUpButton>
                                            </div>
                                        </SignedOut>
                                        <SignedIn>
                                            <UserButton
                                                appearance={{
                                                    elements: {
                                                        avatarBox:
                                                            "h-10 w-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all",
                                                        userButtonPopoverCard:
                                                            "shadow-xl border-0",
                                                        userButtonPopoverHeader:
                                                            "bg-gradient-to-r from-blue-50 to-purple-50",
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
                        <PlausibleAnalytics />
                    </NextIntlClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
