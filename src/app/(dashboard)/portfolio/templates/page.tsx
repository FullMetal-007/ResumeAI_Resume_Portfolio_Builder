"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Globe, Star, Sparkles } from "lucide-react";
import { PORTFOLIO_TEMPLATE_META } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TEMPLATE_DETAILS = {
    "developer-dark": {
        features: ["Terminal-inspired UI", "Code block showcases", "GitHub stats integration", "Dark mode only"],
        sections: ["Hero", "About", "Projects", "Skills", "Contact"],
        colors: ["#10b981", "#6366f1", "#0f172a"],
    },
    "agency-pro": {
        features: ["Bold hero section", "Project case studies", "Testimonials section", "Light & dark modes"],
        sections: ["Hero", "Services", "Projects", "About", "Contact"],
        colors: ["#6366f1", "#8b5cf6", "#1e1b4b"],
    },
    "minimal-light": {
        features: ["Clean typography", "Subtle animations", "Print-friendly", "High contrast"],
        sections: ["Intro", "Work", "Skills", "Experience", "Contact"],
        colors: ["#0f172a", "#64748b", "#f8fafc"],
    },
} as const;

export default function PortfolioTemplatesPage() {
    return (
        <motion.div
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
                <Link href="/portfolio" className="text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Portfolio Templates</h1>
                    <p className="text-white/50 text-sm">Choose a template and customize it with your content</p>
                </div>
            </motion.div>

            {/* Templates */}
            <div className="space-y-6">
                {PORTFOLIO_TEMPLATE_META.map((t, i) => {
                    const details = TEMPLATE_DETAILS[t.id];
                    // @ts-ignore - isPremium added to metadata
                    const isPremium = t.isPremium;

                    return (
                        <motion.div
                            key={t.id}
                            variants={itemVariants}
                            className={cn(
                                "glass rounded-2xl overflow-hidden border transition-all duration-300",
                                isPremium ? "border-purple-500/20 hover:border-purple-500/40" : "border-white/5 hover:border-indigo-500/20"
                            )}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Preview */}
                                <div className={`md:w-72 h-48 md:h-auto ${t.preview} flex-shrink-0 flex items-center justify-center relative`}>
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="relative z-10 text-center px-4">
                                        <Globe className="w-10 h-10 text-white/30 mx-auto mb-2" />
                                        <p className="text-white font-bold text-lg">{t.name}</p>
                                    </div>
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm flex items-center gap-1">
                                            {i === 0 && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                            {t.tag}
                                        </span>
                                        {isPremium && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/80 text-white font-bold backdrop-blur-sm flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> PRO
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold text-white">{t.name}</h2>
                                                {isPremium && <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase">Premium</span>}
                                            </div>
                                            <p className="text-sm text-white/50 mt-0.5">{t.description}</p>
                                        </div>
                                        {/* Color swatches */}
                                        <div className="flex gap-1.5 flex-shrink-0 ml-4">
                                            {details.colors.map((c) => (
                                                <div key={c} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <p className="text-xs font-semibold text-white/40 mb-2">FEATURES</p>
                                            <ul className="space-y-1">
                                                {details.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                                                        <span className="w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-white/40 mb-2">SECTIONS</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {details.sections.map((s) => (
                                                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                if (isPremium) {
                                                    toast.info("This is a Premium template. Upgrade to Pro to use it!", {
                                                        action: {
                                                            label: "Upgrade",
                                                            onClick: () => window.location.href = "/#pricing"
                                                        }
                                                    });
                                                } else {
                                                    window.location.href = `/portfolio/editor?template=${t.id}`;
                                                }
                                            }}
                                            className={cn(
                                                "btn-glow flex items-center gap-2 py-2 px-5 text-sm",
                                                isPremium && "from-purple-600 to-indigo-600 shadow-purple-500/20"
                                            )}
                                        >
                                            {isPremium ? "Get Pro Access" : "Use Template"} <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href={`/portfolio/editor?template=${t.id}&preview=true`}
                                            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-white/60 hover:text-white transition-all border border-white/10"
                                        >
                                            Preview
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* AI CTA */}
            <motion.div variants={itemVariants} className="mt-8 glass rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-r from-purple-600/5 to-indigo-600/5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-semibold">Want something more personalized?</p>
                        <p className="text-white/50 text-sm mt-0.5">Let AI generate a custom portfolio tailored to your profile</p>
                    </div>
                    <Link href="/portfolio/agent" className="btn-glow flex items-center gap-2 py-2.5 px-5 text-sm flex-shrink-0 ml-4">
                        Try AI Mode <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
