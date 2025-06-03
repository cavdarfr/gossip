import { useTranslations } from "next-intl";
import { Heart, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
    const t = useTranslations("footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                        {/* Brand Section */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                                <span className="text-2xl font-bold">
                                    Gossip
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                                {t("description")}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-3 hidden">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-white hover:text-gray-900"
                            >
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-white hover:text-gray-900"
                            >
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 py-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-400">
                            <p className="flex items-center justify-center">
                                &copy; {currentYear} Gossip. {t("madeWith")}{" "}
                                <Heart className="w-4 h-4 mx-1 text-red-500" />
                                {t("by")}{" "}
                                <a
                                    href="https://cavdar.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors ml-1"
                                >
                                    cavdar.fr
                                </a>
                                . {t("rights")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
