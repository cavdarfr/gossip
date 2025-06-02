import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { StoryPageClient } from "./story-page-client";

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

type Props = {
    params: Promise<{ id: string; locale: string }>;
};

export default async function StoryPage({ params }: Props) {
    const { userId } = await auth();
    const { id, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    if (!userId) {
        redirect("/sign-in");
    }

    const story = await getStoryData(id, userId);

    if (!story) {
        notFound();
    }

    return <StoryPageClient story={story} locale={locale} />;
}
