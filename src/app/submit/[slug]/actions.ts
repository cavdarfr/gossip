"use server";

import prisma from "@/lib/prisma";
import { StoryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface SubmitStoryData {
    eventId: string;
    submitterEmail: string;
    submitterUsername: string;
    title: string;
    content: string;
    anonymous: boolean;
    tags: string[];
}

export async function submitStory(data: SubmitStoryData) {
    // Validate the event exists and is active
    const event = await prisma.event.findUnique({
        where: {
            id: data.eventId,
            isActive: true, // Only allow submissions to active events
        },
    });

    if (!event) {
        throw new Error("Event not found or not accepting submissions");
    }

    // Validate required fields
    if (!data.title.trim()) {
        throw new Error("Story title is required");
    }

    if (!data.content.trim()) {
        throw new Error("Story content is required");
    }

    if (data.content.length > 10000) {
        throw new Error("Story content must be less than 10,000 characters");
    }

    // For non-anonymous submissions, require email and username
    if (!data.anonymous) {
        if (!data.submitterEmail.trim()) {
            throw new Error("Email is required for non-anonymous submissions");
        }
        if (!data.submitterUsername.trim()) {
            throw new Error(
                "Username is required for non-anonymous submissions"
            );
        }
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(data.submitterEmail)) {
            throw new Error("Please enter a valid email address");
        }
    }

    // Clean and validate tags
    const cleanTags = data.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && tag.length <= 30)
        .slice(0, 10); // Limit to 10 tags

    try {
        const story = await prisma.story.create({
            data: {
                eventId: data.eventId,
                submitterEmail: data.anonymous ? "" : data.submitterEmail,
                submitterUsername: data.anonymous ? "" : data.submitterUsername,
                title: data.title.trim(),
                content: data.content.trim(),
                anonymous: data.anonymous,
                tags: cleanTags,
                status: StoryStatus.PENDING_REVIEW, // All public submissions start as pending
            },
        });

        // Revalidate the event page for the event owner
        revalidatePath(`/event/${event.slug}`);

        return { success: true, storyId: story.id };
    } catch (error) {
        console.error("Error creating story:", error);
        throw new Error("Failed to submit story. Please try again.");
    }
}
