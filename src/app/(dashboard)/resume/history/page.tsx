"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft, Clock, FileText, Download, Trash2,
    Plus, Star, StarOff, Copy, MoreHorizontal, Cloud, HardDrive
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    listResumes, deleteResume, toggleStarResume, saveResume,
    isCloudStorage
} from "@/lib/resume-storage";
import { TableSkeleton, Skeleton } from "@/components/ui/skeletons";

interface ResumeVersion {
    id: string;
    name: string;
    template: string;
    atsScore?: number;
    createdAt: string;
    updatedAt: string;
    starred: boolean;
    wordCount: number;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function ATSBadge({ score }: { score?: number }) {
    if (!score) return <span className="text-xs text-white/30">No score</span>;
    const color = score >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : score >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
            : "text-red-400 bg-red-500/10 border-red-500/20";
    return (
        <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", color)}>
            ATS {score}%
        </span>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ResumeHistoryPage() {
    const [versions, setVersions] = useState<ResumeVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const cloudStorage = isCloudStorage();

    // Load resumes from storage on mount
    useEffect(() => {
        listResumes().then((saved) => {
            const mapped: ResumeVersion[] = saved.map((r) => ({
                id: r.id,
                name: r.name,
                template: (r.config?.template as string) ?? "Modern Professional",
                atsScore: r.atsScore,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                starred: r.starred,
                wordCount: JSON.stringify(r.data).split(/\s+/).length,
            }));
            setVersions(mapped);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const toggleStar = async (id: string) => {
        setVersions((v) => v.map((r) => r.id === id ? { ...r, starred: !r.starred } : r));
        try {
            await toggleStarResume(id);
            toast.success("Updated");
        } catch {
            // Revert on error
            setVersions((v) => v.map((r) => r.id === id ? { ...r, starred: !r.starred } : r));
            toast.error("Failed to update");
        }
    };

    const deleteVersion = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setVersions((v) => v.filter((r) => r.id !== id));
        setOpenMenu(null);
        try {
            await deleteResume(id);
            toast.success("Version deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const duplicateVersion = async (id: string) => {
        const original = versions.find((v) => v.id === id);
        if (!original) return;
        setOpenMenu(null);

        try {
            const all = await listResumes();
            const full = all.find((r) => r.id === id);
            if (!full) { toast.error("Could not duplicate"); return; }

            const copy = await saveResume({
                name: `${full.name} (Copy)`,
                data: full.data,
                //@ts-ignore
                config: full.config,
                starred: false,
            });
            const newVersion: ResumeVersion = {
                id: copy.id,
                name: copy.name,
                template: (copy.config?.template as string) ?? "Modern Professional",
                atsScore: copy.atsScore,
                createdAt: copy.createdAt,
                updatedAt: copy.updatedAt,
                starred: false,
                wordCount: JSON.stringify(copy.data).split(/\s+/).length,
            };
            setVersions((v) => [newVersion, ...v]);
            toast.success("Version duplicated");
        } catch {
            toast.error("Failed to duplicate");
        }
    };

    const starred = versions.filter((v) => v.starred);
    const rest = versions.filter((v) => !v.starred);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4 space-y-8">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-6">
                    <div>
                        <Skeleton className="h-4 w-28 mb-4 opacity-20" />
                        <TableSkeleton rows={2} />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-32 mb-4 opacity-20" />
                        <TableSkeleton rows={4} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Link href="/resume" className="text-white/40 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Resume Versions</h1>
                        <p className="text-white/50 text-sm">{versions.length} saved versions</p>
                    </div>
                </div>
                <Link href="/resume" className="btn-glow flex items-center gap-2 py-2.5 px-5 text-sm">
                    <Plus className="w-4 h-4" /> New Resume
                </Link>
            </motion.div>

            {/* All versions */}
            {
                !loading && rest.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <p className="text-xs font-semibold text-white/40 mb-3 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> ALL VERSIONS
                        </p>
                        <div className="space-y-2">
                            {rest.map((v) => (
                                <VersionCard
                                    key={v.id}
                                    version={v}
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                    onStar={toggleStar}
                                    onDelete={deleteVersion}
                                    onDuplicate={duplicateVersion}
                                />
                            ))}
                        </div>
                    </motion.div>
                )
            }

            {/* Loading state */}
            {
                loading && (
                    <div className="space-y-6">
                        <div>
                            <Skeleton className="h-4 w-28 mb-3 opacity-20" />
                            <TableSkeleton rows={3} />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-32 mb-3 opacity-20" />
                            <TableSkeleton rows={5} />
                        </div>
                    </div>
                )
            }

            {/* Empty state */}
            {
                !loading && versions.length === 0 && (
                    <motion.div variants={itemVariants} className="glass rounded-2xl p-12 text-center">
                        <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 text-sm mb-1">No saved versions yet</p>
                        <p className="text-white/25 text-xs mb-6">Create and save resumes to see them here</p>
                        <Link href="/resume/editor" className="btn-glow inline-flex items-center gap-2 py-2.5 px-6 text-sm">
                            <Plus className="w-4 h-4" /> Create Resume
                        </Link>
                    </motion.div>
                )
            }

            {/* Storage info banner */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 glass rounded-xl p-4 flex items-start gap-3 border ${cloudStorage ? "border-emerald-500/10" : "border-indigo-500/10"
                    }`}
            >
                {cloudStorage ? (
                    <Cloud className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                    <HardDrive className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                    <p className="text-xs font-medium text-white/70">
                        {cloudStorage ? "Cloud sync active" : "Saved locally on this device"}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                        {cloudStorage
                            ? "Your resumes are synced to your account and available on all devices."
                            : "Set up Google OAuth and MongoDB to enable cloud sync across devices."}
                    </p>
                </div>
            </motion.div>
        </motion.div >
    );
}

function VersionCard({
    version, openMenu, setOpenMenu, onStar, onDelete, onDuplicate,
}: {
    version: ResumeVersion;
    openMenu: string | null;
    setOpenMenu: (id: string | null) => void;
    onStar: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
}) {
    return (
        <motion.div
            className="glass rounded-xl border border-white/5 hover:border-white/10 transition-all"
            whileHover={{ y: -1 }}
        >
            <div className="flex items-center gap-4 p-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white truncate">{version.name}</p>
                        <ATSBadge score={version.atsScore} />
                    </div>
                    <p className="text-xs text-white/40">
                        {version.template} · {version.wordCount} words · Updated {formatDate(version.updatedAt)}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={() => onStar(version.id)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        title={version.starred ? "Unstar" : "Star"}
                    >
                        {version.starred
                            ? <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            : <StarOff className="w-4 h-4 text-white/30 hover:text-white/60" />
                        }
                    </button>
                    <Link
                        href={`/resume?version=${version.id}`}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                        title="Open"
                    >
                        <FileText className="w-4 h-4" />
                    </Link>
                    <button
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                        title="Download PDF"
                        onClick={() => toast.info("Open the resume editor to download PDF")}
                    >
                        <Download className="w-4 h-4" />
                    </button>

                    {/* More menu */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenMenu(openMenu === version.id ? null : version.id)}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenu === version.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 glass rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
                                <button
                                    onClick={() => onDuplicate(version.id)}
                                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Copy className="w-3.5 h-3.5" /> Duplicate
                                </button>
                                <button
                                    onClick={() => onDelete(version.id)}
                                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
