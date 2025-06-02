import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {t("welcome")}
                </h1>
                <p className="text-lg text-gray-600">{t("description")}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <SignedOut>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            {t("getStarted")}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t("signInPrompt")}
                        </p>
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-medium text-blue-900 mb-2">
                                    {t("secureAuth")}
                                </h3>
                                <p className="text-blue-700 text-sm">
                                    {t("secureAuthDesc")}
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-medium text-green-900 mb-2">
                                    {t("quickSetup")}
                                </h3>
                                <p className="text-green-700 text-sm">
                                    {t("quickSetupDesc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </SignedOut>

                <SignedIn>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            {t("welcomeBack")}
                            {user?.firstName ? `, ${user.firstName}` : ""}!
                        </h2>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-green-900 mb-2">
                                {t("authSuccessful")}
                            </h3>
                            <p className="text-green-700">
                                {t("authSuccessfulDesc")}
                            </p>
                        </div>

                        {user && (
                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                <h4 className="font-medium text-gray-900 mb-3">
                                    {t("yourProfile")}
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t("email")}
                                        </span>
                                        <span className="text-gray-900">
                                            {
                                                user.emailAddresses[0]
                                                    ?.emailAddress
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t("userId")}
                                        </span>
                                        <span className="text-gray-900 font-mono text-xs">
                                            {user.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            {t("created")}
                                        </span>
                                        <span className="text-gray-900">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString(locale)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SignedIn>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {t("nextSteps")}
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>{t("nextStepsList.envVars")}</li>
                        <li>{t("nextStepsList.customizeAuth")}</li>
                        <li>{t("nextStepsList.protectedRoutes")}</li>
                        <li>{t("nextStepsList.userManagement")}</li>
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {t("resources")}
                    </h3>
                    <div className="space-y-2">
                        <a
                            href="https://clerk.com/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                            {t("resourceLinks.clerkDocs")}
                        </a>
                        <a
                            href="https://clerk.com/docs/quickstarts/nextjs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                            {t("resourceLinks.nextjsGuide")}
                        </a>
                        <a
                            href="https://clerk.com/docs/components/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                            {t("resourceLinks.uiComponents")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
