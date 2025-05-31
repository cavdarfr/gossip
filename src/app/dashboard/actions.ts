"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
        throw new Error("Title and description are required");
    }

    // Find or create user
    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        const clerkUser = await auth();
        if (clerkUser) {
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: "", // Will be updated when needed
                    username: "user",
                },
            });
        }
    }

    if (!user) {
        throw new Error("Failed to create or find user");
    }

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    try {
        await prisma.event.create({
            data: {
                title,
                description,
                slug,
                userId: user.id,
                isActive: true,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error creating event:", error);
        throw new Error("Failed to create event");
    }
}

export async function deleteEvent(eventId: string) {
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

    // Check if the event exists and belongs to the user
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
            userId: user.id,
        },
        include: {
            _count: {
                select: {
                    stories: true,
                },
            },
        },
    });

    if (!event) {
        throw new Error("Event not found or access denied");
    }

    try {
        // Delete all related stories first (due to foreign key constraints)
        await prisma.story.deleteMany({
            where: {
                eventId: eventId,
            },
        });

        // Then delete the event
        await prisma.event.delete({
            where: { id: eventId },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        throw new Error("Failed to delete event");
    }
}

export async function updateEvent(eventId: string, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "true";

    if (!title || !description) {
        throw new Error("Title and description are required");
    }

    // Find the user
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if the event exists and belongs to the user
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
            userId: user.id,
        },
    });

    if (!event) {
        throw new Error("Event not found or access denied");
    }

    // Generate new slug if title changed
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                description,
                slug,
                isActive,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath(`/event/${event.slug}`);
        revalidatePath(`/event/${slug}`); // Revalidate new slug path too
        return { success: true };
    } catch (error) {
        console.error("Error updating event:", error);
        throw new Error("Failed to update event");
    }
}
