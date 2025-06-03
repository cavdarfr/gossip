import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, description, slug } = body;

        if (!title || !description || !slug) {
            return NextResponse.json(
                { error: "Title, description, and slug are required" },
                { status: 400 }
            );
        }

        // Check if user exists, create if not
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            const clerkUser = await currentUser();
            if (clerkUser?.emailAddresses[0]?.emailAddress) {
                const userEmail = clerkUser.emailAddresses[0].emailAddress;

                // Try to find existing user by email
                const existingUser = await prisma.user.findUnique({
                    where: { email: userEmail },
                });

                if (existingUser) {
                    // Update the existing user's clerkId (transition from dev to prod)
                    user = await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { clerkId: userId },
                    });
                } else {
                    // Create new user if doesn't exist at all
                    user = await prisma.user.create({
                        data: {
                            clerkId: userId,
                            email: userEmail,
                            username:
                                clerkUser.username ||
                                clerkUser.firstName ||
                                "user",
                        },
                    });
                }
            } else {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }
        }

        // Check if slug is unique
        const existingEvent = await prisma.event.findUnique({
            where: { slug },
        });

        if (existingEvent) {
            return NextResponse.json(
                { error: "Event slug already exists" },
                { status: 400 }
            );
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                slug,
                userId: user.id,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
