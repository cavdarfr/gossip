"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, CheckCircle } from "lucide-react";

interface ShareEventButtonProps {
    eventSlug: string;
    eventTitle: string;
}

export function ShareEventButton({
    eventSlug,
    eventTitle,
}: ShareEventButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Create the shareable URL
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/submit/${eventSlug}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (fallbackError) {
                console.error("Failed to copy link:", fallbackError);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden md:block md:ml-2">Share Event</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Event</DialogTitle>
                    <DialogDescription>
                        Share this link with others so they can submit stories
                        for &quot;{eventTitle}&quot;
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="share-url">Submission Link</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="share-url"
                                value={shareUrl}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                size="sm"
                                onClick={handleCopyLink}
                                variant={copied ? "default" : "outline"}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                        {copied && (
                            <p className="text-sm text-green-600">
                                Link copied to clipboard!
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>What others will see:</Label>
                        <div className="p-3 bg-muted rounded-lg text-sm">
                            <div className="font-medium">{eventTitle}</div>
                            <div className="text-muted-foreground">
                                A public form where people can submit their
                                stories for this event
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
