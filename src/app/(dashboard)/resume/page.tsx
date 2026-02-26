"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Wand2, Plus, ArrowRight, Sparkles, Target } from "lucide-react";

const modes = [
    {
        id: "template",
        title: "Template Mode",
        description: "Choose from 5 premium templates and fill in your details with a live preview editor.",
        icon: FileText,
        gradient: "from-indigo-600 to-blue-600",
        href: "/resume/editor",
        features: ["5 premium templates", "Live preview", "Color customization", "PDF & DOCX export"],
        badge: "Quick Start",
    },
    {
        id: "ai",
        title: "AI Custom Mode",
        description: "Upload your resume or fill a form, add a job description, and let AI optimize everything for ATS.",
        icon: Wand2,
        gradient: "from-purple-600 to-pink-600",
        href: "/resume/custom",
        features: ["AI bullet rewriting", "ATS score simulation", "Keyword optimization", "Career coach tips"],
        badge: "⚡ AI Powered",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ResumePage() {
    return (
        <motion.div
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Resume Builder</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Build Your Resume</h1>
                <p className="text-white/50">Choose your mode — template-based or AI-powered generation.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {modes.map((mode) => (
                    <Link key={mode.id} href={mode.href}>
                        <motion.div
                            className="card-premium h-full cursor-pointer group relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.gradient} p-0.5`}>
                                        <div className="w-full h-full bg-[#12121a] rounded-[10px] flex items-center justify-center">
                                            <mode.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                                        {mode.badge}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">{mode.title}</h2>
                                <p className="text-white/50 text-sm mb-5 leading-relaxed">{mode.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {mode.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm group-hover:gap-3 transition-all">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>

            {/* ATS Tips */}
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white">ATS Optimization Tips</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/50">
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>Use keywords from the job description in your resume</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>Quantify achievements with numbers and percentages</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>Use standard section headings for ATS compatibility</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
