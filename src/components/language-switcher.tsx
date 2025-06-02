"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

interface LanguageSwitcherProps {
    currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const pathname = usePathname();

    // Remove the current locale from the pathname to get the base path
    // pathname comes as "/fr/dashboard" or "/en/dashboard", we want "/dashboard"
    const pathWithoutLocale =
        pathname.replace(new RegExp(`^/${currentLocale}`), "") || "/";

    return (
        <div className="flex items-center space-x-2">
            <Link
                href={pathWithoutLocale}
                locale="fr"
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentLocale === "fr"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                }`}
            >
                FR
            </Link>
            <Link
                href={pathWithoutLocale}
                locale="en"
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentLocale === "en"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                }`}
            >
                EN
            </Link>
        </div>
    );
}
