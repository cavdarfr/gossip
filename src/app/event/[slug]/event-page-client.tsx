"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Calendar,
    Users,
    Clock,
    CheckCircle,
    ArrowLeft,
    Eye,
    Edit2,
    User,
    Mail,
    BookOpen,
} from "lucide-react";
import Link from "next/link";
import { StoryStatus } from "@prisma/client";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { ShareEventButton } from "@/components/share-event-button";
import { DeleteEventDialog } from "@/components/delete-event-dialog";
import { UpdateEventDialog } from "@/components/update-event-dialog";

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
}

interface Event {
    id: string;
    title: string;
    description: string;
    slug: string;
    isActive: boolean;
    stories: Story[];
}

interface EventPageClientProps {
    event: Event;
}

export function EventPageClient({ event }: EventPageClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isReadingMode = searchParams.get("mode") === "reading";

    // Calculate statistics
    const totalStories = event.stories.length;
    const pendingStories = event.stories.filter(
        (story) => story.status === StoryStatus.PENDING_REVIEW
    ).length;
    const approvedStories = event.stories.filter(
        (story) => story.status === StoryStatus.APPROVED
    ).length;
    const rejectedStories = event.stories.filter(
        (story) => story.status === StoryStatus.REJECTED
    ).length;

    // Filter stories for reading mode (only show approved stories)
    const displayStories = isReadingMode
        ? event.stories.filter((story) => story.status === StoryStatus.APPROVED)
        : event.stories;

    const stats = [
        {
            title: "Total Stories",
            value: totalStories,
            icon: Users,
            description: "Stories submitted",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Pending Review",
            value: pendingStories,
            icon: Clock,
            description: "Awaiting review",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Approved",
            value: approvedStories,
            icon: CheckCircle,
            description: "Stories approved",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Rejected",
            value: rejectedStories,
            icon: Calendar,
            description: "Stories rejected",
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    const getStatusBadge = (status: StoryStatus) => {
        switch (status) {
            case StoryStatus.PENDING_REVIEW:
                return (
                    <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-300"
                    >
                        Pending
                    </Badge>
                );
            case StoryStatus.APPROVED:
                return (
                    <Badge variant="default" className="bg-green-600">
                        Approved
                    </Badge>
                );
            case StoryStatus.REJECTED:
                return <Badge variant="destructive">Rejected</Badge>;
            case StoryStatus.READ:
                return <Badge variant="secondary">Read</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const createStoryLink = (storyId: string) => {
        const params = new URLSearchParams();
        if (isReadingMode) {
            params.set("mode", "reading");
        }
        return `/story/${storyId}${
            params.toString() ? `?${params.toString()}` : ""
        }`;
    };

    const handleEventDeleted = () => {
        // Redirect to dashboard after successful deletion
        router.push("/dashboard");
    };

    if (isReadingMode) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Reading Mode Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-bold tracking-tight">
                                {event.title}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {event.description}
                            </p>
                        </div>
                        <ReadingModeToggle />
                    </div>

                    {/* Reading Mode Stories */}
                    <div className="space-y-8">
                        {displayStories.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-12">
                                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No approved stories yet
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Stories will appear here once they
                                            are approved.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            displayStories.map((story) => (
                                <Card
                                    key={story.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <CardTitle className="text-xl">
                                                    <Link
                                                        href={createStoryLink(
                                                            story.id
                                                        )}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {story.title}
                                                    </Link>
                                                </CardTitle>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4" />
                                                        <span>
                                                            {story.anonymous
                                                                ? "Anonymous"
                                                                : story.submitterUsername}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(
                                                                story.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-foreground leading-relaxed">
                                                {story.content.length > 300
                                                    ? `${story.content.substring(
                                                          0,
                                                          300
                                                      )}...`
                                                    : story.content}
                                            </p>
                                        </div>
                                        {story.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {story.tags.map(
                                                    (tag, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <Link
                                                href={createStoryLink(story.id)}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Read Full Story
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Edition Mode (original layout)
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="space-y-4 mb-8">
                    {/* Back Button and Basic Info */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {event.title}
                            </h1>
                            <p className="text-muted-foreground">
                                {event.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant={event.isActive ? "default" : "secondary"}
                        >
                            {event.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    {/* Responsive Action Buttons */}
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        {/* Desktop: Show all buttons with text */}
                        <div className="hidden md:flex items-center space-x-2">
                            <ReadingModeToggle />
                            <ShareEventButton
                                eventSlug={event.slug}
                                eventTitle={event.title}
                            />
                            <UpdateEventDialog
                                event={{
                                    id: event.id,
                                    title: event.title,
                                    description: event.description,
                                    isActive: event.isActive,
                                }}
                                variant="button"
                                size="sm"
                            />
                            <DeleteEventDialog
                                eventId={event.id}
                                eventTitle={event.title}
                                storiesCount={event.stories.length}
                                variant="button"
                                size="sm"
                                onDeleted={handleEventDeleted}
                            />
                        </div>

                        {/* Mobile: Icon-only buttons */}
                        <div className="md:hidden flex items-center justify-start space-x-2">
                            <ReadingModeToggle />
                            <ShareEventButton
                                eventSlug={event.slug}
                                eventTitle={event.title}
                            />
                            <UpdateEventDialog
                                event={{
                                    id: event.id,
                                    title: event.title,
                                    description: event.description,
                                    isActive: event.isActive,
                                }}
                                variant="icon"
                                size="sm"
                            />
                            <DeleteEventDialog
                                eventId={event.id}
                                eventTitle={event.title}
                                storiesCount={event.stories.length}
                                variant="icon"
                                size="sm"
                                onDeleted={handleEventDeleted}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {!isReadingMode && (
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
                        {stats.map((stat) => {
                            const IconComponent = stat.icon;
                            return (
                                <Card key={stat.title}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                        <div
                                            className={`p-2 rounded-lg ${stat.bgColor}`}
                                        >
                                            <IconComponent
                                                className={`h-4 w-4 ${stat.color}`}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {stat.value}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Stories Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stories</CardTitle>
                        <CardDescription>
                            Review and manage stories submitted for this event.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {event.stories.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No stories yet
                                </h3>
                                <p className="text-muted-foreground">
                                    Stories submitted to this event will appear
                                    here.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Story</TableHead>
                                                <TableHead>Submitter</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Tags</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {event.stories.map((story) => (
                                                <TableRow key={story.id}>
                                                    <TableCell>
                                                        <div className="space-y-1 max-w-xs">
                                                            <div className="font-medium truncate">
                                                                {story.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {story.content.substring(
                                                                    0,
                                                                    100
                                                                )}
                                                                ...
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">
                                                                    {story.anonymous
                                                                        ? "Anonymous"
                                                                        : story.submitterUsername}
                                                                </span>
                                                            </div>
                                                            {!story.anonymous && (
                                                                <div className="flex items-center space-x-2">
                                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {
                                                                            story.submitterEmail
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            story.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {story.tags.length >
                                                            0 ? (
                                                                story.tags
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            tag,
                                                                            index
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    index
                                                                                }
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </Badge>
                                                                        )
                                                                    )
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm">
                                                                    No tags
                                                                </span>
                                                            )}
                                                            {story.tags.length >
                                                                2 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    +
                                                                    {story.tags
                                                                        .length -
                                                                        2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(
                                                            story.createdAt
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end space-x-1">
                                                            <Link
                                                                href={createStoryLink(
                                                                    story.id
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={`/story/${story.id}/review`}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden space-y-4">
                                    {event.stories.map((story) => (
                                        <Card
                                            key={story.id}
                                            className="border border-border"
                                        >
                                            <CardContent className="p-4">
                                                {/* Story Title and Content Preview */}
                                                <div className="mb-3">
                                                    <h3 className="font-semibold text-base mb-1">
                                                        {story.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {story.content.substring(
                                                            0,
                                                            150
                                                        )}
                                                        ...
                                                    </p>
                                                </div>

                                                {/* Status and Submitter Info */}
                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    {getStatusBadge(
                                                        story.status
                                                    )}
                                                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />
                                                        <span>
                                                            {story.anonymous
                                                                ? "Anonymous"
                                                                : story.submitterUsername}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            story.createdAt
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                {story.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {story.tags
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    tag,
                                                                    index
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {tag}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        {story.tags.length >
                                                            3 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                +
                                                                {story.tags
                                                                    .length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={createStoryLink(
                                                            story.id
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/story/${story.id}/review`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
