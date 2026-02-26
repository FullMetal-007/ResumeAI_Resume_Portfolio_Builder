"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TEMPLATE_META } from "@/components/resume/templates";
import { FileText, Globe, ArrowRight, Star } from "lucide-react";

const portfolioTemplates = [
    {
        id: "developer-dark",
        name: "Developer Dark",
        description: "Dark-themed portfolio with terminal aesthetics. Perfect for developers.",
        tag: "Premium",
        preview: "bg-gradient-to-br from-gray-800 to-gray-950",
        type: "portfolio",
    },
    {
        id: "agency-pro",
        name: "Agency Pro",
        description: "Clean agency-style portfolio with project showcases.",
        tag: "Premium",
        preview: "bg-gradient-to-br from-blue-600 to-indigo-800",
        type: "portfolio",
    },
    {
        id: "minimal-light",
        name: "Minimal Light",
        description: "Clean, minimal light-mode portfolio with elegant typography.",
        tag: "Free",
        preview: "bg-gradient-to-br from-slate-200 to-slate-400",
        type: "portfolio",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TemplatesPage() {
    return (
        <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Templates</h1>
                <p className="text-white/50">Premium resume and portfolio templates to get you started</p>
            </motion.div>

            {/* Resume Templates */}
            <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Resume Templates</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                        {TEMPLATE_META.length} templates
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {TEMPLATE_META.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                            className="group"
                        >
                            <Link href={`/resume/editor?template=${t.id}`}>
                                <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                                    <div className={`h-40 ${t.preview} flex items-center justify-center relative`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="relative z-10 text-center px-3">
                                            <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
                                                {t.tag}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-semibold text-white mb-1">{t.name}</p>
                                        <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{t.description}</p>
                                        <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium mt-2 group-hover:gap-2 transition-all">
                                            Use Template <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Portfolio Templates */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Portfolio Templates</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                        {portfolioTemplates.length} templates
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {portfolioTemplates.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="group"
                        >
                            <Link href={`/portfolio?template=${t.id}`}>
                                <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                                    <div className={`h-48 ${t.preview} flex items-center justify-center relative`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <Globe className="relative z-10 w-12 h-12 text-white/30" />
                                        <div className="absolute top-3 right-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full backdrop-blur-sm ${t.tag === "Premium"
                                                    ? "bg-amber-500/30 text-amber-300 border border-amber-500/30"
                                                    : "bg-black/40 text-white/80"
                                                }`}>
                                                {t.tag === "Premium" && <Star className="w-3 h-3 inline mr-1" />}
                                                {t.tag}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-semibold text-white mb-1">{t.name}</p>
                                        <p className="text-xs text-white/40 leading-relaxed">{t.description}</p>
                                        <div className="flex items-center gap-1 text-purple-400 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                                            Use Template <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
