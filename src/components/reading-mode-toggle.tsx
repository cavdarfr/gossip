"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit3 } from "lucide-react";

interface ReadingModeToggleProps {
    className?: string;
}

export function ReadingModeToggle({ className }: ReadingModeToggleProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isReadingMode, setIsReadingMode] = useState(false);
    const t = useTranslations("event");

    // Check if reading mode is active from URL params
    useEffect(() => {
        const readingMode = searchParams.get("mode") === "reading";
        setIsReadingMode(readingMode);
    }, [searchParams]);

    const toggleReadingMode = () => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (isReadingMode) {
            // Switch to edition mode - remove the mode parameter
            newParams.delete("mode");
        } else {
            // Switch to reading mode - add the mode parameter
            newParams.set("mode", "reading");
        }

        const newUrl = newParams.toString()
            ? `${pathname}?${newParams.toString()}`
            : pathname;

        router.push(newUrl);
    };

    return (
        <Button
            variant={isReadingMode ? "default" : "outline"}
            size="sm"
            onClick={toggleReadingMode}
            className={className}
        >
            {isReadingMode ? (
                <>
                    <Edit3 className="h-4 w-4" />
                    <span className="hidden md:block md:ml-2">
                        {t("managementMode")}
                    </span>
                </>
            ) : (
                <>
                    <BookOpen className="h-4 w-4" />
                    <span className=" hidden md:block md:ml-2">
                        {t("readingMode")}
                    </span>
                </>
            )}
        </Button>
    );
}

// Hook to check if reading mode is active
export function useReadingMode() {
    const searchParams = useSearchParams();
    return searchParams.get("mode") === "reading";
}
