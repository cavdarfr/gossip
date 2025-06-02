import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export default async function EventPage({ params }: Props) {
    const { userId } = await auth();
    const { slug, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    if (!userId) {
        redirect("/sign-in");
    }

    const event = await getEventData(slug, userId);

    if (!event) {
        notFound();
    }

    return <EventPageClient event={event} locale={locale} />;
}
