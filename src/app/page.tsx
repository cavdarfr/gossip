import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
    const user = await currentUser();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Gossip
                </h1>
                <p className="text-lg text-gray-600">
                    A secure chat application powered by Clerk authentication
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <SignedOut>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Get Started
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Sign in or create an account to start using Gossip
                        </p>
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-medium text-blue-900 mb-2">
                                    🔐 Secure Authentication
                                </h3>
                                <p className="text-blue-700 text-sm">
                                    Your account is protected with
                                    industry-standard security
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-medium text-green-900 mb-2">
                                    ⚡ Quick Setup
                                </h3>
                                <p className="text-green-700 text-sm">
                                    Get started in seconds with social login or
                                    email
                                </p>
                            </div>
                        </div>
                    </div>
                </SignedOut>

                <SignedIn>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Welcome back
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
                                Authentication Successful!
                            </h3>
                            <p className="text-green-700">
                                You&apos;re now signed in and ready to use all
                                features of Gossip.
                            </p>
                        </div>

                        {user && (
                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                <h4 className="font-medium text-gray-900 mb-3">
                                    Your Profile:
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email:
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
                                            User ID:
                                        </span>
                                        <span className="text-gray-900 font-mono text-xs">
                                            {user.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Created:
                                        </span>
                                        <span className="text-gray-900">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
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
                        🚀 Next Steps
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Set up your Clerk environment variables</li>
                        <li>• Customize your authentication flow</li>
                        <li>• Add protected routes and API endpoints</li>
                        <li>• Configure user management features</li>
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        📚 Resources
                    </h3>
                    <div className="space-y-2">
                        <a
                            href="https://clerk.com/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                            → Clerk Documentation
                        </a>
                        <a
                            href="https://clerk.com/docs/quickstarts/nextjs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                            → Next.js Integration Guide
                        </a>
                        <a
                            href="https://clerk.com/docs/components/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                            → UI Components Reference
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
