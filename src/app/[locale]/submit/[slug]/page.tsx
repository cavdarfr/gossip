import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
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

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export default async function PublicSubmissionPage({ params }: Props) {
    const { slug, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const event = await getPublicEventData(slug);
    const t = await getTranslations("submit");
    const dashboard = await getTranslations("dashboard.events.status");

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("description", { eventTitle: event.title })}
                    </p>
                </div>

                {/* Event Info */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                {event.title}
                            </CardTitle>
                            <Badge variant="default">
                                {dashboard("active")}
                            </Badge>
                        </div>
                        <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                </Card>

                {/* Submission Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>
                            {t("description", { eventTitle: event.title })}
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
