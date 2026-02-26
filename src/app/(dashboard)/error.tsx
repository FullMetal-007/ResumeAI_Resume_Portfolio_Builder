"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[DashboardError]", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <motion.div
                className="glass rounded-3xl p-10 max-w-lg w-full text-center border border-red-500/10 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Dashboard Error</h2>
                <p className="text-white/50 text-sm mb-8 leading-relaxed">
                    We encountered an error while loading your dashboard.
                    Your data is safe, but we need a quick refresh.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="btn-glow flex items-center gap-2 py-3 px-8 text-sm w-full sm:w-auto"
                    >
                        <RotateCcw className="w-4 h-4" /> Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-3 glass rounded-xl text-sm text-white/60 hover:text-white transition-all w-full sm:w-auto"
                    >
                        Back home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
