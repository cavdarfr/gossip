import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { EventPageClient } from "./event-page-client";

async function getEventData(slug: string, userId: string) {
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) return null;

    const event = await prisma.event.findFirst({
        where: {
            slug,
            userId: user.id,
        },
        include: {
            stories: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    return event;
}

export default async function EventPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { slug } = await params;
    const event = await getEventData(slug, userId);

    if (!event) {
        notFound();
    }

    return <EventPageClient event={event} />;
}
