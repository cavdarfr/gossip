import { useTranslations } from "next-intl";
import { BookOpenTextIcon } from "lucide-react";

export function Footer() {
    const t = useTranslations("footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Brand Section */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <BookOpenTextIcon className="w-8 h-8 text-blue-400" />
                        <span className="text-xl font-bold">Gossip</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                        {t("description")}
                    </p>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="text-center">
                        <div className="text-sm text-gray-400">
                            <p>
                                &copy; {currentYear} Gossip by{" "}
                                <a
                                    href="https://cavdar.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    cavdar.fr
                                </a>
                                . {t("rights")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Structured Data for Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Gossip",
                        url: "https://gossip.vercel.app",
                        logo: "https://gossip.vercel.app/icon-512x512.png",
                        description:
                            "Modern storytelling platform where communities come together to share experiences and connect with others.",
                        founder: {
                            "@type": "Person",
                            name: "cavdar.fr",
                            url: "https://cavdar.fr",
                        },
                        foundingDate: currentYear.toString(),
                    }),
                }}
            />
        </footer>
    );
}
