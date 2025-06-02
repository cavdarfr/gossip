import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // List of all locales that are supported
    locales: ["fr", "en"],

    // French as default locale
    defaultLocale: "fr",
});
