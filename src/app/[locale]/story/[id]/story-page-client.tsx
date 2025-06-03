"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, Edit2 } from "lucide-react";
import Link from "next/link";
import { StoryStatus } from "@prisma/client";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";

interface Story {
    id: string;
    title: string;
    content: string;
    submitterEmail: string;
    submitterUsername: string;
    anonymous: boolean;
    tags: string[];
    status: StoryStatus;
    createdAt: Date;
    event: {
        title: string;
        slug: string;
    };
}

interface StoryPageClientProps {
    story: Story;
    locale: string;
}

export function StoryPageClient({ story, locale }: StoryPageClientProps) {
    const searchParams = useSearchParams();
    const isReadingMode = searchParams.get("mode") === "reading";
    const t = useTranslations("story");
    const eventT = useTranslations("event.stories");
    const common = useTranslations("common");

    const getStatusBadge = (status: StoryStatus) => {
        switch (status) {
            case StoryStatus.PENDING_REVIEW:
                return (
                    <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-300"
                    >
                        {eventT("status.pending")}
                    </Badge>
                );
            case StoryStatus.APPROVED:
                return (
                    <Badge variant="default" className="bg-green-600">
                        {eventT("status.approved")}
                    </Badge>
                );
            case StoryStatus.REJECTED:
                return (
                    <Badge variant="destructive">
                        {eventT("status.rejected")}
                    </Badge>
                );
            case StoryStatus.READ:
                return (
                    <Badge variant="secondary">{eventT("status.read")}</Badge>
                );
            default:
                return (
                    <Badge variant="outline">{common("unknownStatus")}</Badge>
                );
        }
    };

    const createEventLink = () => {
        const params = new URLSearchParams();
        if (isReadingMode) {
            params.set("mode", "reading");
        }
        return `/${locale}/event/${story.event.slug}${
            params.toString() ? `?${params.toString()}` : ""
        }`;
    };

    if (isReadingMode) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Reading Mode Header - Responsive */}
                    <div className="space-y-4 mb-8">
                        {/* Back Button and Reading Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <Link href={createEventLink()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="max-w-xs"
                                >
                                    <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate ml-2">
                                        {t("backToEvent")} {story.event.title}
                                    </span>
                                </Button>
                            </Link>
                            <ReadingModeToggle />
                        </div>

                        {/* Story Title */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words">
                                {story.title}
                            </h1>
                        </div>

                        {/* Story Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-muted-foreground text-sm">
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">
                                    {story.anonymous
                                        ? t("anonymous")
                                        : story.submitterUsername}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span>
                                    {new Date(
                                        story.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                            {story.content}
                        </div>
                    </div>

                    {/* Tags */}
                    {story.tags.length > 0 && (
                        <div className="mt-8 pt-8 border-t">
                            <div className="flex flex-wrap gap-2">
                                {story.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Edition Mode - Responsive Layout
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header - Responsive */}
                <div className="space-y-4 mb-8">
                    {/* Back Button and Basic Info */}
                    <div className="flex items-center justify-between">
                        <Link href={`/${locale}/event/${story.event.slug}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="max-w-xs sm:max-w-sm"
                            >
                                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate ml-2">
                                    {t("backToEvent")} {story.event.title}
                                </span>
                            </Button>
                        </Link>
                    </div>
                    {/* Status Badge - Always visible */}
                    <div className="flex-shrink-0">
                        {getStatusBadge(story.status)}
                    </div>

                    {/* Story Title */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
                            {story.title}
                        </h1>
                    </div>

                    {/* Action Buttons - Responsive */}
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        {/* Desktop: Horizontal layout */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <ReadingModeToggle />
                            <Link href={`/${locale}/story/${story.id}/review`}>
                                <Button variant="outline" size="sm">
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    {t("actions.review")}
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile: Vertical layout */}
                        <div className="sm:hidden space-y-2">
                            <ReadingModeToggle />
                            <Link
                                href={`/${locale}/story/${story.id}/review`}
                                className="block"
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    {t("actions.review")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Story Metadata - Responsive */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t("storyDetails")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm font-medium">
                                        {t("submittedBy")}:
                                    </span>
                                    <span className="text-sm truncate">
                                        {story.anonymous
                                            ? t("anonymous")
                                            : story.submitterUsername}
                                    </span>
                                </div>
                                {!story.anonymous && (
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="text-sm font-medium">
                                            Email:
                                        </span>
                                        <span className="text-sm text-muted-foreground truncate">
                                            {story.submitterEmail}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm font-medium">
                                        {t("submittedOn")}:
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(
                                            story.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <span className="text-sm font-medium flex-shrink-0">
                                        {t("tags")}:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {story.tags.length > 0 ? (
                                            story.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                {t("noTags")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Story Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t("storyContent")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-foreground leading-relaxed break-words">
                                {story.content}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
