"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Wand2, LayoutTemplate, ArrowRight, Globe,
    Sparkles, Pencil, Trash2, Clock, Cloud, HardDrive
} from "lucide-react";
import { PORTFOLIO_TEMPLATE_META } from "@/types/portfolio";
import { listPortfolios, deletePortfolio, isCloudStorage, SavedPortfolio } from "@/lib/portfolio-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PortfolioSkeleton } from "@/components/ui/skeletons";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PortfolioPage() {
    const [savedPortfolios, setSavedPortfolios] = useState<SavedPortfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const cloudStorage = isCloudStorage();

    useEffect(() => {
        loadPortfolios();
    }, []);

    const loadPortfolios = async () => {
        setLoading(true);
        try {
            const data = await listPortfolios();
            setSavedPortfolios(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this portfolio?")) return;
        const ok = await deletePortfolio(id);
        if (ok) {
            setSavedPortfolios(prev => prev.filter(p => p.id !== id));
            toast.success("Portfolio deleted");
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-4">
                <PortfolioSkeleton />
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Portfolio Builder</h1>
                    <p className="text-white/50">
                        Choose a template or let AI generate your entire portfolio from scratch
                    </p>
                </div>
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-medium tracking-wider uppercase",
                    cloudStorage
                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                        : "bg-white/5 border-white/10 text-white/40"
                )}>
                    {cloudStorage ? <><Cloud className="w-3 h-3" /> Cloud Sync Active</> : <><HardDrive className="w-3 h-3" /> Local Storage</>}
                </div>
            </motion.div>

            {/* Mode cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                <Link href="/portfolio/templates">
                    <motion.div
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="glass rounded-2xl p-7 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer group h-full"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-5">
                            <LayoutTemplate className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Template Mode</h2>
                        <p className="text-white/50 text-sm leading-relaxed mb-5">
                            Pick a professionally designed template and customize it with your content. Fast and beautiful.
                        </p>
                        <ul className="space-y-2 mb-6">
                            {["3 premium templates", "Instant preview", "Full content control", "One-click deploy"].map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm group-hover:gap-3 transition-all">
                            Browse Templates <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </Link>

                <Link href="/portfolio/agent">
                    <motion.div
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="relative glass rounded-2xl p-7 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer group h-full overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/5 pointer-events-none" />
                        <div className="absolute top-3 right-3">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                                ✨ AI Powered
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-5">
                                < Wand2 className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">AI Agent Mode</h2>
                            <p className="text-white/50 text-sm leading-relaxed mb-5">
                                Answer a few questions and let Gemini generate your entire Next.js portfolio — ready to deploy.
                            </p>
                            <ul className="space-y-2 mb-6">
                                {[
                                    "Full Next.js project generated",
                                    "Tailwind + Framer Motion included",
                                    "ZIP download or Vercel deploy",
                                    "Personalized AI content",
                                ].map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                                        <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm group-hover:gap-3 transition-all">
                                Start AI Wizard <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Recent Portfolios */}
            <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-white">Recent Portfolios</h2>
                    {savedPortfolios.length > 0 && (
                        <p className="text-xs text-white/40">{savedPortfolios.length} portfolios saved</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {savedPortfolios.length === 0 ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center glass border border-white/5 border-dashed rounded-2xl">
                                <Globe className="w-10 h-10 text-white/5 mb-3" />
                                <p className="text-white/30 text-sm font-medium">No portfolios created yet</p>
                                <Link href="/portfolio/templates" className="text-indigo-400 text-xs mt-2 hover:underline">Pick a template to start</Link>
                            </div>
                        ) : (
                            savedPortfolios.map((p) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-sm font-bold text-white truncate mb-1">{p.name || "Untitled"}</h3>
                                    <p className="text-[10px] text-white/40 flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {new Date(p.updatedAt).toLocaleDateString()}
                                    </p>
                                    <div className="mt-4">
                                        <Link
                                            href={`/portfolio/editor?id=${p.id}`}
                                            className="w-full flex items-center justify-center gap-1.5 py-1.5 glass rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-center"
                                        >
                                            <Pencil className="w-3 h-3" /> Edit Portfolio
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Template previews */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-white">Available Templates</h2>
                    <Link href="/portfolio/templates" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PORTFOLIO_TEMPLATE_META.slice(0, 3).map((t) => (
                        <div key={t.id} className="group">
                            <Link href={`/portfolio/editor?template=${t.id}`}>
                                <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                                    <div className={`h-36 ${t.preview} flex items-center justify-center relative`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <Globe className="relative z-10 w-8 h-8 text-white/30" />
                                        <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
                                            {t.tag}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-semibold text-white mb-1">{t.name}</p>
                                        <p className="text-xs text-white/40 leading-relaxed truncate">{t.description}</p>
                                        <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                                            Use Template <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}


