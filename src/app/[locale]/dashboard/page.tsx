import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { StoryStatus } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar, Users, Clock, CheckCircle, Eye } from "lucide-react";
import { CreateEventDialog } from "./create-event-dialog";
import { DeleteEventDialog } from "@/components/delete-event-dialog";
import { UpdateEventDialog } from "@/components/update-event-dialog";
import { Link } from "@/i18n/navigation";

async function getDashboardData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
            events: {
                include: {
                    stories: true,
                    _count: {
                        select: {
                            stories: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) {
        // Create user if doesn't exist
        const clerkUser = await currentUser();
        if (clerkUser) {
            const newUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || "",
                    username:
                        clerkUser.username || clerkUser.firstName || "user",
                },
                include: {
                    events: {
                        include: {
                            stories: true,
                            _count: {
                                select: {
                                    stories: true,
                                },
                            },
                        },
                    },
                },
            });
            return newUser;
        }
        return null;
    }

    return user;
}

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const { userId } = await auth();
    const t = await getTranslations("dashboard");

    if (!userId) {
        redirect({ href: "/sign-in", locale });
        return; // This return is needed for TypeScript, though it won't be reached
    }

    const userData = await getDashboardData(userId);

    if (!userData) {
        return <div>{t("errorLoading")}</div>;
    }

    // Calculate statistics
    const totalEvents = userData.events.length;
    const totalStories = userData.events.reduce(
        (acc, event) => acc + event.stories.length,
        0
    );
    const pendingStories = userData.events.reduce(
        (acc, event) =>
            acc +
            event.stories.filter(
                (story) => story.status === StoryStatus.PENDING_REVIEW
            ).length,
        0
    );
    const approvedStories = userData.events.reduce(
        (acc, event) =>
            acc +
            event.stories.filter(
                (story) => story.status === StoryStatus.APPROVED
            ).length,
        0
    );

    const stats = [
        {
            title: t("stats.totalEvents"),
            value: totalEvents,
            icon: Calendar,
            description: t("stats.totalEventsDesc"),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: t("stats.totalStories"),
            value: totalStories,
            icon: Users,
            description: t("stats.totalStoriesDesc"),
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: t("stats.pendingReview"),
            value: pendingStories,
            icon: Clock,
            description: t("stats.pendingReviewDesc"),
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: t("stats.approved"),
            value: approvedStories,
            icon: CheckCircle,
            description: t("stats.approvedDesc"),
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t("title")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("welcomeBack", { username: userData.username })}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <CreateEventDialog />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`p-2 rounded-lg ${stat.bgColor}`}
                                    >
                                        <IconComponent
                                            className={`h-4 w-4 ${stat.color}`}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Events Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("events.title")}</CardTitle>
                        <CardDescription>
                            {t("events.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userData.events.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {t("events.noEvents")}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {t("events.noEventsDesc")}
                                </p>
                                <CreateEventDialog />
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    {t(
                                                        "events.tableHeaders.event"
                                                    )}
                                                </TableHead>
                                                <TableHead>
                                                    {t(
                                                        "events.tableHeaders.status"
                                                    )}
                                                </TableHead>
                                                <TableHead>
                                                    {t(
                                                        "events.tableHeaders.stories"
                                                    )}
                                                </TableHead>
                                                <TableHead>
                                                    {t(
                                                        "events.tableHeaders.pending"
                                                    )}
                                                </TableHead>
                                                <TableHead>
                                                    {t(
                                                        "events.tableHeaders.created"
                                                    )}
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    {t(
                                                        "events.tableHeaders.actions"
                                                    )}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userData.events.map((event) => {
                                                const eventPendingStories =
                                                    event.stories.filter(
                                                        (story) =>
                                                            story.status ===
                                                            StoryStatus.PENDING_REVIEW
                                                    ).length;

                                                return (
                                                    <TableRow key={event.id}>
                                                        <TableCell>
                                                            <div className="space-y-1 max-w-xs">
                                                                <div className="font-medium">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-muted-foreground line-clamp-2">
                                                                    {
                                                                        event.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    event.isActive
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {event.isActive
                                                                    ? t(
                                                                          "events.status.active"
                                                                      )
                                                                    : t(
                                                                          "events.status.inactive"
                                                                      )}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                                <span>
                                                                    {
                                                                        event
                                                                            .stories
                                                                            .length
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {eventPendingStories >
                                                            0 ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-yellow-600"
                                                                >
                                                                    {
                                                                        eventPendingStories
                                                                    }
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">
                                                                    0
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {new Date(
                                                                event.createdAt
                                                            ).toLocaleDateString(
                                                                locale
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end space-x-1">
                                                                <Link
                                                                    href={`/event/${event.slug}`}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <UpdateEventDialog
                                                                    event={{
                                                                        id: event.id,
                                                                        title: event.title,
                                                                        description:
                                                                            event.description,
                                                                        isActive:
                                                                            event.isActive,
                                                                    }}
                                                                    variant="icon"
                                                                    size="sm"
                                                                />
                                                                <DeleteEventDialog
                                                                    eventId={
                                                                        event.id
                                                                    }
                                                                    eventTitle={
                                                                        event.title
                                                                    }
                                                                    storiesCount={
                                                                        event
                                                                            .stories
                                                                            .length
                                                                    }
                                                                    variant="icon"
                                                                    size="sm"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden space-y-4">
                                    {userData.events.map((event) => {
                                        const eventPendingStories =
                                            event.stories.filter(
                                                (story) =>
                                                    story.status ===
                                                    StoryStatus.PENDING_REVIEW
                                            ).length;

                                        return (
                                            <Card
                                                key={event.id}
                                                className="border border-border"
                                            >
                                                <CardContent>
                                                    {/* Row 1: Event Title */}
                                                    <div className="mb-2">
                                                        <h3 className="font-semibold text-base">
                                                            {event.title}
                                                        </h3>
                                                    </div>

                                                    {/* Row 2: Truncated Description */}
                                                    <div className="mb-3">
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {event.description}
                                                        </p>
                                                    </div>

                                                    {/* Row 3: Event Information */}
                                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                                        <Badge
                                                            variant={
                                                                event.isActive
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {event.isActive
                                                                ? t(
                                                                      "events.status.active"
                                                                  )
                                                                : t(
                                                                      "events.status.inactive"
                                                                  )}
                                                        </Badge>
                                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                            <Users className="h-3 w-3" />
                                                            <span>
                                                                {
                                                                    event
                                                                        .stories
                                                                        .length
                                                                }{" "}
                                                                {t(
                                                                    "events.storiesCount"
                                                                )}
                                                            </span>
                                                        </div>
                                                        {eventPendingStories >
                                                            0 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-yellow-600 text-xs"
                                                            >
                                                                {
                                                                    eventPendingStories
                                                                }{" "}
                                                                {t(
                                                                    "events.pending"
                                                                )}
                                                            </Badge>
                                                        )}
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                event.createdAt
                                                            ).toLocaleDateString(
                                                                locale
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Row 4: Action Buttons */}
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/event/${event.slug}`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {t(
                                                                    "events.actions.view"
                                                                )}
                                                            </Button>
                                                        </Link>
                                                        <UpdateEventDialog
                                                            event={{
                                                                id: event.id,
                                                                title: event.title,
                                                                description:
                                                                    event.description,
                                                                isActive:
                                                                    event.isActive,
                                                            }}
                                                            variant="icon"
                                                            size="sm"
                                                        />
                                                        <DeleteEventDialog
                                                            eventId={event.id}
                                                            eventTitle={
                                                                event.title
                                                            }
                                                            storiesCount={
                                                                event.stories
                                                                    .length
                                                            }
                                                            variant="icon"
                                                            size="sm"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
