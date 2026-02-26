"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    FileText, Globe, TrendingUp, Clock, Sparkles,
    ArrowRight, Plus, Zap, Star, Bot, Wand2,
    Download, CheckCircle2, ChevronRight
} from "lucide-react";

const stats = [
    { label: "Resumes Created", value: "0", icon: FileText, color: "from-indigo-500 to-blue-500", href: "/resume" },
    { label: "Portfolios Built", value: "0", icon: Globe, color: "from-purple-500 to-pink-500", href: "/portfolio" },
    { label: "ATS Score Avg", value: "—", icon: TrendingUp, color: "from-emerald-500 to-teal-500", href: "/resume/custom" },
    { label: "AI Generations", value: "0", icon: Zap, color: "from-amber-500 to-orange-500", href: "/resume" },
];

const quickActions = [
    {
        title: "Build Resume",
        description: "Create an ATS-optimized resume with AI assistance",
        href: "/resume",
        icon: FileText,
        gradient: "from-indigo-600 to-blue-600",
        badge: "AI Powered",
        badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/20",
    },
    {
        title: "Build Portfolio",
        description: "Generate a full Next.js portfolio site with Gemini",
        href: "/portfolio",
        icon: Globe,
        gradient: "from-purple-600 to-pink-600",
        badge: "Agent Mode",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/20",
    },
    {
        title: "Browse Templates",
        description: "Explore premium resume & portfolio templates",
        href: "/templates",
        icon: Star,
        gradient: "from-amber-600 to-orange-600",
        badge: "5+ Templates",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/20",
    },
];

const features = [
    {
        icon: Bot,
        title: "AI Resume Optimizer",
        description: "Rewrites your bullet points to be more impactful and ATS-friendly",
        href: "/resume/custom",
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
    },
    {
        icon: TrendingUp,
        title: "ATS Score Checker",
        description: "Instantly score your resume against any job description",
        href: "/resume/custom",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        icon: Wand2,
        title: "Portfolio AI Wizard",
        description: "Answer 5 questions, get a full deployable Next.js portfolio",
        href: "/portfolio/agent",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    {
        icon: Download,
        title: "PDF & ZIP Export",
        description: "Download your resume as PDF or portfolio as a ZIP project",
        href: "/resume",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/skeletons";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial payload check
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Resume & Portfolio Builder</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back 👋</h1>
                <p className="text-white/50">Ready to build something amazing? Choose where to start.</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <div className="card-premium group cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 mb-3`}>
                                <div className="w-full h-full bg-[#12121a] rounded-[10px] flex items-center justify-center">
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Start</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.href} href={action.href}>
                            <motion.div
                                className="card-premium group cursor-pointer h-full"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} p-0.5 mb-4`}>
                                    <div className="w-full h-full bg-[#12121a] rounded-[10px] flex items-center justify-center">
                                        <action.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-white">{action.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${action.badgeColor}`}>
                                        {action.badge}
                                    </span>
                                </div>
                                <p className="text-sm text-white/50 mb-4">{action.description}</p>
                                <div className="flex items-center gap-1 text-indigo-400 text-sm font-medium group-hover:gap-2 transition-all">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Two-column: Features + Activity */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* AI Features */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">AI Features</h2>
                        <span className="text-xs text-white/30 px-2 py-0.5 glass rounded-full">Powered by Gemini 2.5</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((f) => (
                            <Link key={f.title} href={f.href}>
                                <motion.div
                                    className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                                    whileHover={{ y: -2 }}
                                >
                                    <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                                        <f.icon className={`w-4.5 h-4.5 ${f.color}`} />
                                    </div>
                                    <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
                                    <p className="text-xs text-white/40 leading-relaxed">{f.description}</p>
                                    <div className={`flex items-center gap-1 text-xs ${f.color} mt-3 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        Try it <ChevronRight className="w-3 h-3" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity + Getting Started */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Recent Activity */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                            <Link href="/resume" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                                <Plus className="w-4 h-4" /> New
                            </Link>
                        </div>
                        <div className="glass rounded-2xl p-6 text-center">
                            <Clock className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-white/40 text-sm">No activity yet</p>
                            <p className="text-white/25 text-xs mt-1">Create your first resume to get started</p>
                            <Link href="/resume" className="btn-glow inline-flex items-center gap-2 mt-4 text-sm py-2 px-5">
                                <Plus className="w-4 h-4" /> Create Resume
                            </Link>
                        </div>
                    </div>

                    {/* Getting Started Checklist */}
                    <div className="glass rounded-2xl p-5 border border-indigo-500/10">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-sm font-semibold text-white">Getting Started</h3>
                        </div>
                        <div className="space-y-2.5">
                            {[
                                { label: "Create your first resume", href: "/resume", done: false },
                                { label: "Run ATS score check", href: "/resume/custom", done: false },
                                { label: "Browse portfolio templates", href: "/portfolio/templates", done: false },
                                { label: "Try the AI Portfolio Wizard", href: "/portfolio/agent", done: false },
                            ].map((item) => (
                                <Link key={item.label} href={item.href}>
                                    <div className="flex items-center gap-3 py-1.5 group cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${item.done ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover:border-indigo-400"}`}>
                                            {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-xs transition-colors ${item.done ? "text-white/30 line-through" : "text-white/60 group-hover:text-white"}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
