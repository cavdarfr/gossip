import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { eventId } = await params;
        const body = await request.json();
        const { isActive } = body;

        if (typeof isActive !== "boolean") {
            return NextResponse.json(
                { error: "isActive must be a boolean" },
                { status: 400 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if the event exists and belongs to the user
        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                userId: user.id,
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found or access denied" },
                { status: 404 }
            );
        }

        // Update the event status
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: { isActive },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("Error toggling event status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
