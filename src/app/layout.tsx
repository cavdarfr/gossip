import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";
import { BookOpenTextIcon } from "lucide-react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Gossip App",
    description: "A Next.js app with Clerk authentication",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <header className="border-b border-gray-200 bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center space-x-8">
                                    <Link
                                        href="/"
                                        className="text-xl font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2"
                                    >
                                        <BookOpenTextIcon className="w-6 h-6" />{" "}
                                        Gossip
                                    </Link>
                                    <SignedIn>
                                        <nav className="flex space-x-4">
                                            <Link
                                                href="/dashboard"
                                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                        </nav>
                                    </SignedIn>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <SignedOut>
                                        <SignInButton mode="modal">
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </SignedOut>
                                    <SignedIn>
                                        <UserButton
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-8 w-8",
                                                },
                                            }}
                                        />
                                    </SignedIn>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main>{children}</main>
                </body>
            </html>
        </ClerkProvider>
    );
}
