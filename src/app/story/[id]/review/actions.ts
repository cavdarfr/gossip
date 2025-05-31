"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { StoryStatus } from "@prisma/client";

export async function updateStoryStatus(storyId: string, status: StoryStatus) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Find the user
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if the story exists and belongs to an event owned by the user
    const story = await prisma.story.findFirst({
        where: {
            id: storyId,
            event: {
                userId: user.id,
            },
        },
        include: {
            event: true,
        },
    });

    if (!story) {
        throw new Error("Story not found or access denied");
    }

    try {
        await prisma.story.update({
            where: { id: storyId },
            data: { status },
        });

        revalidatePath(`/story/${storyId}`);
        revalidatePath(`/story/${storyId}/review`);
        revalidatePath(`/event/${story.event.slug}`);
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Error updating story status:", error);
        throw new Error("Failed to update story status");
    }
}

export async function updateStoryTags(storyId: string, tags: string[]) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // Find the user
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if the story exists and belongs to an event owned by the user
    const story = await prisma.story.findFirst({
        where: {
            id: storyId,
            event: {
                userId: user.id,
            },
        },
        include: {
            event: true,
        },
    });

    if (!story) {
        throw new Error("Story not found or access denied");
    }

    // Filter out empty tags and trim whitespace
    const cleanTags = tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags

    try {
        await prisma.story.update({
            where: { id: storyId },
            data: { tags: cleanTags },
        });

        revalidatePath(`/story/${storyId}`);
        revalidatePath(`/story/${storyId}/review`);
        revalidatePath(`/event/${story.event.slug}`);

        return { success: true };
    } catch (error) {
        console.error("Error updating story tags:", error);
        throw new Error("Failed to update story tags");
    }
}
