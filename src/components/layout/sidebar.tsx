"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, FileText, Globe, LayoutTemplate,
    BarChart3, Settings, Sparkles, LogOut, ChevronLeft, X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/resume", icon: FileText, label: "Resume Builder" },
    { href: "/portfolio", icon: Globe, label: "Portfolio Builder" },
    { href: "/templates", icon: LayoutTemplate, label: "Templates" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    /** On mobile, sidebar is an overlay drawer */
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
        toast.success("Signed out");
    };


    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            className="font-bold text-base gradient-text-brand whitespace-nowrap overflow-hidden"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            ResumeAI
                        </motion.span>
                    )}
                </AnimatePresence>
                {/* Desktop collapse toggle */}
                <button
                    onClick={onToggle}
                    className="ml-auto text-white/30 hover:text-white transition-colors flex-shrink-0 hidden md:block"
                >
                    <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")} />
                </button>
                {/* Mobile close button */}
                {onMobileClose && (
                    <button
                        onClick={onMobileClose}
                        className="ml-auto text-white/30 hover:text-white transition-colors flex-shrink-0 md:hidden"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={cn(
                                "sidebar-item",
                                isActive && "active",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        className="whitespace-nowrap overflow-hidden"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Pro badge + logout */}
            <div className="p-2 border-t border-white/5 space-y-1">
                {!collapsed && (
                    <div className="mx-2 mb-2 p-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20">
                        <p className="text-xs font-semibold text-indigo-300 mb-1">✨ Upgrade to Pro</p>
                        <p className="text-xs text-white/40">Unlimited AI generations</p>
                        <Link
                            href="/settings?tab=billing"
                            className="mt-2 block text-center text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Upgrade
                        </Link>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={cn(
                        "sidebar-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10",
                        collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? "Sign Out" : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                Sign Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <motion.aside
                className="fixed left-0 top-0 h-full z-40 flex-col glass border-r border-white/5 hidden md:flex"
                animate={{ width: collapsed ? 72 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile drawer overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                        />
                        {/* Drawer */}
                        <motion.aside
                            className="fixed left-0 top-0 h-full z-50 w-64 glass border-r border-white/5 md:hidden"
                            initial={{ x: -256 }}
                            animate={{ x: 0 }}
                            exit={{ x: -256 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
