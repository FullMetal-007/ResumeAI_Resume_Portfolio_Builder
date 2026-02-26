"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, FileText, Globe, Zap, Clock } from "lucide-react";

const stats = [
    { label: "Total Resumes", value: "0", change: "+0%", icon: FileText, color: "text-indigo-400" },
    { label: "Portfolios Built", value: "0", change: "+0%", icon: Globe, color: "text-purple-400" },
    { label: "AI Generations", value: "0", change: "+0%", icon: Zap, color: "text-amber-400" },
    { label: "Avg ATS Score", value: "—", change: "—", icon: TrendingUp, color: "text-emerald-400" },
];

export default function AnalyticsPage() {
    return (
        <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-white/50">Track your resume and portfolio performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                    <div key={s.label} className="card-premium">
                        <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                        <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                        <p className="text-xs text-emerald-400 mt-1">{s.change}</p>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            <div className="glass rounded-2xl p-12 text-center">
                <BarChart3 className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No data yet</h3>
                <p className="text-white/40 text-sm">Create resumes and portfolios to start tracking your activity</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white/25">
                    <Clock className="w-3.5 h-3.5" />
                    Analytics will populate as you use the platform
                </div>
            </div>
        </motion.div>
    );
}
