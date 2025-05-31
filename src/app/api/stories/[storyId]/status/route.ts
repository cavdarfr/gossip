import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StoryStatus } from "@prisma/client";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ storyId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { storyId } = await params;
        const body = await request.json();
        const { status } = body;

        if (!Object.values(StoryStatus).includes(status)) {
            return NextResponse.json(
                { error: "Invalid status value" },
                { status: 400 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
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
            return NextResponse.json(
                { error: "Story not found or access denied" },
                { status: 404 }
            );
        }

        // Update the story status
        const updatedStory = await prisma.story.update({
            where: { id: storyId },
            data: { status },
        });

        return NextResponse.json(updatedStory);
    } catch (error) {
        console.error("Error updating story status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
