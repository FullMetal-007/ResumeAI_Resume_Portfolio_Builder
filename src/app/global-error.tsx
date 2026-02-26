"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[GlobalError]", error);
    }, [error]);

    return (
        <html>
            <body className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
                    <p className="text-white/50 text-sm mb-2 leading-relaxed">
                        An unexpected error occurred. This has been logged automatically.
                    </p>
                    {error.digest && (
                        <p className="text-white/20 text-xs font-mono mb-6">Error ID: {error.digest}</p>
                    )}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={reset}
                            className="btn-glow flex items-center gap-2 py-2.5 px-6 text-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                        <Link
                            href="/dashboard"
                            className="px-6 py-2.5 glass rounded-xl text-sm text-white/60 hover:text-white transition-all border border-white/10"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
