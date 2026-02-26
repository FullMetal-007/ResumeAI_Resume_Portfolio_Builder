"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wand2, Target, Upload, Loader2, Sparkles, ChevronLeft,
    AlertCircle, CheckCircle2, FileText, X, File
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { ATSScore } from "@/types/resume";

// ─── File Upload Zone ────────────────────────────────────────────────────────

interface FileUploadZoneProps {
    label: string;
    accept?: string;
    file: File | null;
    onFile: (f: File) => void;
    onClear: () => void;
    loading?: boolean;
    hint?: string;
}

function FileUploadZone({ label, accept, file, onFile, onClear, loading, hint }: FileUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) onFile(dropped);
        },
        [onFile]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) onFile(f);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (name: string) => {
        const ext = name.split(".").pop()?.toLowerCase();
        if (ext === "pdf") return "📄";
        if (ext === "docx" || ext === "doc") return "📝";
        return "📃";
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-medium text-white/60 block">{label}</label>

            {file ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-xl p-4 flex items-center gap-3 border border-indigo-500/20"
                >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg flex-shrink-0">
                        {getFileIcon(file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-white/40">{formatSize(file.size)}</p>
                    </div>
                    {loading ? (
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                    ) : (
                        <button
                            onClick={onClear}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200
                        ${dragging
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-white/10 hover:border-white/20 hover:bg-white/3"
                        }
                    `}
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragging ? "bg-indigo-500/20" : "bg-white/5"}`}>
                            <Upload className={`w-5 h-5 ${dragging ? "text-indigo-400" : "text-white/30"}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white/70">
                                {dragging ? "Drop it here!" : "Drop your file here"}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                                or <span className="text-indigo-400 hover:text-indigo-300">browse</span> to upload
                            </p>
                        </div>
                        <p className="text-xs text-white/25">{hint ?? "PDF, DOCX, or TXT · Max 5MB"}</p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept ?? ".pdf,.docx,.txt"}
                        onChange={handleChange}
                        className="hidden"
                    />
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumeCustomPage() {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [activeTab, setActiveTab] = useState<"ats" | "optimize">("ats");

    // Parse uploaded resume file → extract text
    const handleResumeFile = async (file: File) => {
        setResumeFile(file);
        setParsing(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/resume/parse-file", { method: "POST", body: form });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? "Failed to parse file");
            }
            const { text } = await res.json();
            setResumeText(text);
            toast.success("Resume parsed successfully!");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to read file");
            setResumeFile(null);
            setResumeText("");
        } finally {
            setParsing(false);
        }
    };

    const clearResumeFile = () => {
        setResumeFile(null);
        setResumeText("");
        setAtsScore(null);
    };

    const handleATSScore = async () => {
        if (!resumeText.trim()) {
            toast.error("Please upload your resume first");
            return;
        }
        if (!jobDescription.trim()) {
            toast.error("Please paste the job description");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/resume/ats-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText, jobDescription }),
            });
            if (!res.ok) throw new Error("ATS scoring failed");
            const score: ATSScore = await res.json();
            setAtsScore(score);
            toast.success("ATS analysis complete!");
        } catch {
            toast.error("ATS scoring failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-amber-400";
        return "text-red-400";
    };

    const scoreRingColor = (score: number) => {
        if (score >= 80) return "#10b981";
        if (score >= 60) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/resume" className="text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Custom Mode</h1>
                    <p className="text-white/50 text-sm">ATS scoring, keyword analysis, and AI optimization</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 glass rounded-xl p-1 mb-6 w-fit">
                {[
                    { id: "ats", label: "ATS Score Checker", icon: Target },
                    { id: "optimize", label: "AI Optimize", icon: Wand2 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "ats" | "optimize")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? "bg-indigo-600 text-white"
                            : "text-white/50 hover:text-white"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "ats" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <div className="space-y-5">
                        {/* Resume file upload */}
                        <FileUploadZone
                            label="Your Resume"
                            file={resumeFile}
                            onFile={handleResumeFile}
                            onClear={clearResumeFile}
                            loading={parsing}
                            hint="PDF, DOCX, or TXT · Max 5MB"
                        />

                        {/* Parsed text preview */}
                        <AnimatePresence>
                            {resumeText && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="glass rounded-xl p-3 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs text-emerald-400 font-medium">
                                                {resumeText.length.toLocaleString()} characters extracted
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/30 line-clamp-3 font-mono leading-relaxed">
                                            {resumeText.slice(0, 200)}…
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Job description */}
                        <div>
                            <label className="text-xs font-medium text-white/60 mb-2 block">
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                rows={8}
                                className="input-glass w-full text-sm resize-none"
                            />
                        </div>

                        <button
                            onClick={handleATSScore}
                            disabled={loading || parsing || !resumeText}
                            className="btn-glow w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                            {loading ? "Analyzing..." : parsing ? "Parsing file..." : "Analyze ATS Score"}
                        </button>
                    </div>

                    {/* Results */}
                    <div>
                        {!atsScore ? (
                            <div className="glass rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
                                <Target className="w-12 h-12 text-white/10 mb-3" />
                                <p className="text-white/40 text-sm">ATS analysis results will appear here</p>
                                <p className="text-white/25 text-xs mt-1">
                                    Upload your resume and paste a job description to get started
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Score ring */}
                                <div className="glass rounded-2xl p-6 text-center">
                                    <div className="relative inline-flex items-center justify-center mb-3">
                                        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <circle
                                                cx="60" cy="60" r="50" fill="none"
                                                stroke={scoreRingColor(atsScore.score)}
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(atsScore.score / 100) * 314} 314`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute text-center">
                                            <p className={`text-3xl font-black ${scoreColor(atsScore.score)}`}>{atsScore.score}</p>
                                            <p className="text-xs text-white/40">/ 100</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-white">
                                        {atsScore.score >= 80 ? "Excellent Match! 🎉" : atsScore.score >= 60 ? "Good Match ✅" : "Needs Improvement ⚠️"}
                                    </p>
                                    <p className="text-xs text-white/40 mt-1">ATS Compatibility Score</p>
                                </div>

                                {/* Matched keywords */}
                                {atsScore.matchedKeywords.length > 0 && (
                                    <div className="glass rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <p className="text-sm font-semibold text-white">Matched Keywords ({atsScore.matchedKeywords.length})</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {atsScore.matchedKeywords.map((kw) => (
                                                <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing keywords */}
                                {atsScore.missingKeywords.length > 0 && (
                                    <div className="glass rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle className="w-4 h-4 text-amber-400" />
                                            <p className="text-sm font-semibold text-white">Missing Keywords ({atsScore.missingKeywords.length})</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {atsScore.missingKeywords.map((kw) => (
                                                <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/20">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {atsScore.suggestions.length > 0 && (
                                    <div className="glass rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-indigo-400" />
                                            <p className="text-sm font-semibold text-white">AI Suggestions</p>
                                        </div>
                                        <ul className="space-y-2">
                                            {atsScore.suggestions.map((s, i) => (
                                                <li key={i} className="text-xs text-white/60 flex gap-2">
                                                    <span className="text-indigo-400 flex-shrink-0">→</span>{s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "optimize" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <FileUploadZone
                            label="Upload Resume to Optimize"
                            file={resumeFile}
                            onFile={handleResumeFile}
                            onClear={clearResumeFile}
                            loading={parsing}
                            hint="PDF, DOCX, or TXT · Max 5MB"
                        />

                        <AnimatePresence>
                            {resumeText && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="glass rounded-xl p-3 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs text-emerald-400 font-medium">
                                                Resume loaded — {resumeText.length.toLocaleString()} characters
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="glass rounded-2xl p-6 text-center">
                            <Wand2 className="w-10 h-10 text-indigo-400/50 mx-auto mb-3" />
                            <h3 className="text-base font-semibold text-white mb-2">AI Resume Optimizer</h3>
                            <p className="text-white/50 text-sm mb-5 leading-relaxed">
                                For the best results, use the resume editor to build your resume — then click &ldquo;AI Optimize&rdquo; to let Gemini rewrite your bullets with quantified impact.
                            </p>
                            <Link href="/resume/editor" className="btn-glow inline-flex items-center gap-2 text-sm">
                                <Wand2 className="w-4 h-4" />
                                Open Resume Editor
                            </Link>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <File className="w-12 h-12 text-white/10 mb-3" />
                        <p className="text-white/40 text-sm">Upload a resume to preview extracted content</p>
                        <p className="text-white/25 text-xs mt-1">Supports PDF, DOCX, and TXT files</p>
                    </div>
                </div>
            )}
        </div>
    );
}
