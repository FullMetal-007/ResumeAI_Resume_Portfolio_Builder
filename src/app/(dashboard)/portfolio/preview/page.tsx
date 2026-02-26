"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft, Download, ExternalLink, FileCode2,
    Folder, FolderOpen, Copy, Check, Eye, Code2,
    Save, Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { GeneratedPortfolio, GeneratedFile } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { savePortfolio, isCloudStorage } from "@/lib/portfolio-storage";

const LANG_COLORS: Record<string, string> = {
    tsx: "text-blue-400",
    ts: "text-blue-300",
    css: "text-pink-400",
    json: "text-yellow-400",
    markdown: "text-green-400",
};

function buildFileTree(files: GeneratedFile[]) {
    const tree: Record<string, GeneratedFile[]> = {};
    files.forEach((f) => {
        const parts = f.path.split("/");
        const dir = parts.length > 1 ? parts[0] : "(root)";
        if (!tree[dir]) tree[dir] = [];
        tree[dir].push(f);
    });
    return tree;
}

export default function PortfolioPreviewPage() {
    const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
    const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
    const [openDirs, setOpenDirs] = useState<Set<string>>(new Set(["app", "components", "(root)"]));
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [saving, setSaving] = useState(false);
    const cloudStorage = isCloudStorage();

    useEffect(() => {
        const stored = sessionStorage.getItem("generatedPortfolio");
        if (stored) {
            const data: GeneratedPortfolio = JSON.parse(stored);
            setPortfolio(data);
            if (data.files.length > 0) setSelectedFile(data.files[0]);
        }
    }, []);

    const handleCopy = async () => {
        if (!selectedFile) return;
        await navigator.clipboard.writeText(selectedFile.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard");
    };

    const handleSave = async () => {
        if (!portfolio) return;
        setSaving(true);
        try {
            // Determine name from generated content (or use default)
            const name = "AI Generated Portfolio";

            await savePortfolio({
                name,
                templateId: "developer-dark", // Default or extracted
                data: {
                    personalInfo: { name: "AI Portfolio", title: "Generated", bio: "", email: "" },
                    projects: [],
                    skills: [],
                    experience: [],
                    style: "developer-dark",
                    sections: { showAbout: true, showProjects: true, showSkills: true, showExperience: true, showContact: true },
                    // In a real scenario, we'd map the generated files back 
                    // but for this MVP, we save the metadata.
                    // The 'files' would ideally be saved in the database as well.
                } as any // Cast for now as AI generation creates files, editor uses PortfolioData
            });

            toast.success(cloudStorage ? "Saved to your account! ☁️" : "Saved locally! 💾");
        } catch {
            toast.error("Failed to save portfolio.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeploy = () => {
        toast.info("✨ Premium Feature: One-click Vercel deployment is coming soon!");
    };

    const handleDownloadZip = async () => {
        if (!portfolio) return;
        try {
            const res = await fetch("/api/portfolio/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(portfolio),
            });
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "portfolio-site.zip";
            a.click();
            URL.revokeObjectURL(url);
            toast.success("ZIP exported! 📦");
        } catch {
            toast.error("Download failed. Please try again.");
        }
    };

    if (!portfolio) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <FileCode2 className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 text-sm">No portfolio generated yet.</p>
                <Link href="/portfolio/agent" className="btn-glow py-2.5 px-6 text-sm">
                    Generate Portfolio
                </Link>
            </div>
        );
    }

    const tree = buildFileTree(portfolio.files);

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/portfolio/agent" className="text-white/40 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">Generated Portfolio</h1>
                        <p className="text-white/40 text-xs">{portfolio.files.length} files generated</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Save to Dashboard
                    </button>
                    <button
                        onClick={handleDownloadZip}
                        className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/20"
                    >
                        <Download className="w-4 h-4" /> Download ZIP
                    </button>
                    <button
                        onClick={handleDeploy}
                        className="btn-glow flex items-center gap-2 py-2 px-4 text-sm relative overflow-hidden group"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Deploy
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-4 flex-shrink-0">
                {(["preview", "code"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            activeTab === tab ? "bg-indigo-600 text-white" : "glass text-white/50 hover:text-white"
                        )}
                    >
                        {tab === "preview" ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                        {tab === "preview" ? "Preview" : "Code"}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0">
                {activeTab === "preview" ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full glass rounded-2xl overflow-hidden border border-white/10"
                    >
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                            <span className="text-xs text-white/30 ml-2">Portfolio Preview</span>
                        </div>
                        <iframe
                            srcDoc={portfolio.previewHtml}
                            className="w-full h-[calc(100%-40px)]"
                            title="Portfolio Preview"
                            sandbox="allow-scripts"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex gap-3"
                    >
                        {/* File tree */}
                        <div className="w-56 flex-shrink-0 glass rounded-2xl p-3 overflow-y-auto">
                            <p className="text-xs font-semibold text-white/40 px-2 mb-2">FILES</p>
                            {Object.entries(tree).map(([dir, files]) => (
                                <div key={dir}>
                                    <button
                                        onClick={() => setOpenDirs((s) => {
                                            const n = new Set(s);
                                            n.has(dir) ? n.delete(dir) : n.add(dir);
                                            return n;
                                        })}
                                        className="flex items-center gap-1.5 w-full px-2 py-1 rounded-lg hover:bg-white/5 transition-colors text-left"
                                    >
                                        {openDirs.has(dir) ? (
                                            <FolderOpen className="w-3.5 h-3.5 text-yellow-400/70 flex-shrink-0" />
                                        ) : (
                                            <Folder className="w-3.5 h-3.5 text-yellow-400/70 flex-shrink-0" />
                                        )}
                                        <span className="text-xs text-white/60 truncate">{dir}</span>
                                    </button>
                                    {openDirs.has(dir) && files.map((f) => (
                                        <button
                                            key={f.path}
                                            onClick={() => setSelectedFile(f)}
                                            className={cn(
                                                "flex items-center gap-1.5 w-full px-2 py-1 pl-6 rounded-lg transition-colors text-left",
                                                selectedFile?.path === f.path
                                                    ? "bg-indigo-500/20 text-indigo-300"
                                                    : "hover:bg-white/5 text-white/50"
                                            )}
                                        >
                                            <FileCode2 className={cn("w-3 h-3 flex-shrink-0", LANG_COLORS[f.language] || "text-white/40")} />
                                            <span className="text-xs truncate">{f.path.split("/").pop()}</span>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Code viewer */}
                        <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
                            {selectedFile && (
                                <>
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/3">
                                        <div className="flex items-center gap-2">
                                            <FileCode2 className={cn("w-4 h-4", LANG_COLORS[selectedFile.language] || "text-white/40")} />
                                            <span className="text-xs text-white/60 font-mono">{selectedFile.path}</span>
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                                        >
                                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                    <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-white/70 leading-relaxed">
                                        <code>{selectedFile.content}</code>
                                    </pre>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
