"use client";

export function DebugClerk() {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
            <h3 className="font-bold mb-2">Clerk Debug Info</h3>
            <p>
                <strong>Publishable Key:</strong>
            </p>
            <p className="break-all mb-2">{publishableKey}</p>
            <p>
                <strong>Environment:</strong>{" "}
                {publishableKey?.startsWith("pk_live_")
                    ? "🟢 PRODUCTION"
                    : "🟡 DEVELOPMENT"}
            </p>
            <p>
                <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL}
            </p>
        </div>
    );
}
