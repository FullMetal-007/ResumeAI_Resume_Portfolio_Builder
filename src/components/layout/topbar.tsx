"use client";

import { Bell, Search, Sparkles, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface TopbarProps {
    sidebarCollapsed: boolean;
    onMobileMenuOpen?: () => void;
}

export function Topbar({ sidebarCollapsed, onMobileMenuOpen }: TopbarProps) {
    const { data: session } = useSession();
    const userName = session?.user?.name ?? "";
    const userEmail = session?.user?.email ?? "";

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header
            className="fixed top-0 right-0 z-30 glass border-b border-white/5 flex items-center gap-4 px-4 md:px-6 py-4 transition-all duration-300"
            style={{ left: 0 }}
        >
            {/* Mobile hamburger */}
            <button
                onClick={onMobileMenuOpen}
                className="md:hidden text-white/50 hover:text-white transition-colors p-1"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Desktop left offset spacer */}
            <div
                className="hidden md:block flex-shrink-0 transition-all duration-300"
                style={{ width: sidebarCollapsed ? 72 : 240 }}
            />

            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search resumes, portfolios..."
                        className="input-glass w-full pl-10 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
                {/* AI Credits */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase">AI Credits: 5</span>
                </div>

                {/* Pro badge */}
                <span className={cn(
                    "badge-pro hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer hover:scale-105",
                    session?.user ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                )}>
                    {session?.user ? (
                        <>
                            <Sparkles className="w-3 h-3" />
                            Free Plan
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            Guest Mode
                        </>
                    )}
                </span>

                {/* Notifications */}
                <button className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
                </button>

                {/* Avatar */}
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {initials || "U"}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-white leading-none">{userName}</p>
                        <p className="text-xs text-white/40 mt-0.5">{userEmail}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
