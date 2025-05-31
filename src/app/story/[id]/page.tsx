import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
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

export default async function StoryPage({
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

    return <StoryPageClient story={story} />;
}
