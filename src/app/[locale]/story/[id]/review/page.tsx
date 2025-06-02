import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { StoryStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { ReviewForm } from "./review-form";

async function getStoryData(storyId: string, userId: string) {
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) return null;

    const story = await prisma.story.findFirst({
        where: {
            id: storyId,
            event: {
                userId: user.id,
            },
        },
        include: {
            event: {
                select: {
                    title: true,
                    slug: true,
                },
            },
        },
    });

    return story;
}

export default async function StoryReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { id } = await params;
    const story = await getStoryData(id, userId);

    if (!story) {
        notFound();
    }

    const getStatusBadge = (status: StoryStatus) => {
        switch (status) {
            case StoryStatus.PENDING_REVIEW:
                return (
                    <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-300"
                    >
                        Pending Review
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

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <Link href={`/story/${story.id}`}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Story
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Review Story
                        </h1>
                        <p className="text-muted-foreground">
                            Update status and manage tags for:{" "}
                            <strong>{story.title}</strong>
                        </p>
                    </div>
                    {getStatusBadge(story.status)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Story Content */}
                    <div className="space-y-6">
                        {/* Story Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Story Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            Submitter:
                                        </span>
                                        <span className="text-sm">
                                            {story.anonymous
                                                ? "Anonymous"
                                                : story.submitterUsername}
                                        </span>
                                    </div>
                                    {!story.anonymous && (
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                Email:
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {story.submitterEmail}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            Submitted:
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(
                                                story.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Story Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Story Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                                        {story.content}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Review Form */}
                    <div className="space-y-6">
                        <ReviewForm story={story} />
                    </div>
                </div>
            </div>
        </div>
    );
}
