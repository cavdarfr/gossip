"use client";

import { Sun, Moon, Circle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useTranslations } from "next-intl";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const t = useTranslations("theme");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label={t("toggle")}>
                    {theme === "light" && (
                        <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
                    )}
                    {theme === "dark" && (
                        <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
                    )}
                    {theme === "black" && (
                        <Circle className="h-[1.2rem] w-[1.2rem] text-primary" />
                    )}
                    {theme === "system" && (
                        <Monitor className="h-[1.2rem] w-[1.2rem] text-primary" />
                    )}
                    <span className="sr-only">{t("toggle")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {t("light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {t("dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("black")}>
                    {t("black")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {t("system")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
