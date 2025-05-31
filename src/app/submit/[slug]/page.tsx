import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StorySubmissionForm } from "./story-submission-form";

async function getPublicEventData(slug: string) {
    const event = await prisma.event.findFirst({
        where: {
            slug,
            isActive: true, // Only allow submissions to active events
        },
        select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            isActive: true,
        },
    });

    return event;
}

export default async function PublicSubmissionPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const event = await getPublicEventData(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Share Your Story
                    </h1>
                    <p className="text-muted-foreground">
                        Submit your story for the event below
                    </p>
                </div>

                {/* Event Info */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                {event.title}
                            </CardTitle>
                            <Badge variant="default">Active</Badge>
                        </div>
                        <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                </Card>

                {/* Submission Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Your Story</CardTitle>
                        <CardDescription>
                            Share your experience or thoughts related to this
                            event. All submissions are reviewed before being
                            published.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StorySubmissionForm eventId={event.id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
