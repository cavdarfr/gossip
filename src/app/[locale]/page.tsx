import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays,
    Share2,
    MessageSquare,
    Shield,
    Users,
    Sparkles,
    Heart,
    Building2,
    GraduationCap,
    ArrowRight,
    CheckCircle,
    BookOpen,
} from "lucide-react";

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const user = await currentUser();
    const t = await getTranslations("home");

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="max-w-7xl mx-auto text-center">
                    <div className="max-w-4xl mx-auto">
                        <Badge
                            variant="secondary"
                            className="mb-6 px-4 py-2 text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Modern Storytelling Platform
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            {t("heroTitle")}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                            {t("heroSubtitle")}
                        </p>

                        <SignedOut>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6"
                                    asChild
                                >
                                    <Link href="/sign-up">
                                        {t("getStarted")}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-8 py-6"
                                    asChild
                                >
                                    <Link href="#features">
                                        {t("learnMore")}
                                    </Link>
                                </Button>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-2xl mx-auto mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    {t("welcomeBack")}
                                    {user?.firstName
                                        ? `, ${user.firstName}`
                                        : ""}
                                    !
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {t("authSuccessfulDesc")}
                                </p>
                                <Button size="lg" className="w-full" asChild>
                                    <Link href="/dashboard">
                                        {t("resourceLinks.dashboard")}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {t("features.title")}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t("features.subtitle")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="border-2 hover:border-blue-200 transition-colors">
                            <CardHeader className="text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <CalendarDays className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle>
                                    {t("features.createEvents.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("features.createEvents.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-green-200 transition-colors">
                            <CardHeader className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle>
                                    {t("features.collectStories.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("features.collectStories.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-purple-200 transition-colors">
                            <CardHeader className="text-center">
                                <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-purple-600" />
                                </div>
                                <CardTitle>
                                    {t("features.moderateContent.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("features.moderateContent.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-orange-200 transition-colors">
                            <CardHeader className="text-center">
                                <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Share2 className="w-8 h-8 text-orange-600" />
                                </div>
                                <CardTitle>
                                    {t("features.sharePublicly.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("features.sharePublicly.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {t("howItWorks.title")}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t("howItWorks.subtitle")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: t("howItWorks.step1.title"),
                                description: t("howItWorks.step1.description"),
                                icon: CalendarDays,
                                color: "blue",
                            },
                            {
                                step: "02",
                                title: t("howItWorks.step2.title"),
                                description: t("howItWorks.step2.description"),
                                icon: Share2,
                                color: "green",
                            },
                            {
                                step: "03",
                                title: t("howItWorks.step3.title"),
                                description: t("howItWorks.step3.description"),
                                icon: MessageSquare,
                                color: "purple",
                            },
                            {
                                step: "04",
                                title: t("howItWorks.step4.title"),
                                description: t("howItWorks.step4.description"),
                                icon: BookOpen,
                                color: "orange",
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="text-center">
                                    <div
                                        className={
                                            item.color === "blue"
                                                ? "bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                                                : item.color === "green"
                                                ? "bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                                                : item.color === "purple"
                                                ? "bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                                                : "bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                                        }
                                    >
                                        <item.icon
                                            className={
                                                item.color === "blue"
                                                    ? "w-10 h-10 text-blue-600"
                                                    : item.color === "green"
                                                    ? "w-10 h-10 text-green-600"
                                                    : item.color === "purple"
                                                    ? "w-10 h-10 text-purple-600"
                                                    : "w-10 h-10 text-orange-600"
                                            }
                                        />
                                        <div
                                            className={
                                                item.color === "blue"
                                                    ? "absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                                                    : item.color === "green"
                                                    ? "absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                                                    : item.color === "purple"
                                                    ? "absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                                                    : "absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                                            }
                                        >
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                                {index < 3 && (
                                    <div className="hidden lg:block absolute top-10 left-full w-full">
                                        <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {t("useCases.title")}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t("useCases.subtitle")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="bg-pink-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                                    <Heart className="w-8 h-8 text-pink-600" />
                                </div>
                                <CardTitle>
                                    {t("useCases.wedding.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("useCases.wedding.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <Building2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle>
                                    {t("useCases.corporate.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("useCases.corporate.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle>
                                    {t("useCases.community.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("useCases.community.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                    <GraduationCap className="w-8 h-8 text-purple-600" />
                                </div>
                                <CardTitle>
                                    {t("useCases.education.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {t("useCases.education.description")}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        {t("cta.title")}
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        {t("cta.subtitle")}
                    </p>

                    <SignedOut>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-6"
                                asChild
                            >
                                <Link href="/sign-up">
                                    {t("cta.signUp")}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6"
                                asChild
                            >
                                <Link href="/sign-in">
                                    {t("cta.alreadyUser")}
                                </Link>
                            </Button>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg px-8 py-6"
                            asChild
                        >
                            <Link href="/dashboard">
                                {t("cta.signUp")}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </SignedIn>
                </div>
            </section>
        </div>
    );
}
