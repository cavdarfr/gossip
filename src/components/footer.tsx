import { useTranslations } from "next-intl";
import { Heart, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
    const t = useTranslations("footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background text-foreground" role="contentinfo">
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
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                                {t("description")}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-3 hidden">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                            >
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                            >
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border py-6 bg-card">
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                            <p className="flex items-center justify-center">
                                &copy; {currentYear} Gossip. {t("madeWith")}{" "}
                                <Heart className="w-4 h-4 mx-1 text-red-500" />
                                {t("by")}{" "}
                                <a
                                    href="https://cavdar.fr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-foreground transition-colors ml-1"
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
