"use client";

import Script from "next/script";

export function PlausibleAnalytics() {
    return (
        <>
            <Script
                defer
                data-domain="gossip.cavdar.fr"
                src="https://plausible.cavdar.dev/js/script.outbound-links.js"
                strategy="afterInteractive"
            />
            <Script id="plausible-setup" strategy="afterInteractive">
                {`
                    window.plausible = window.plausible || function() { 
                        (window.plausible.q = window.plausible.q || []).push(arguments) 
                    }
                `}
            </Script>
        </>
    );
}
