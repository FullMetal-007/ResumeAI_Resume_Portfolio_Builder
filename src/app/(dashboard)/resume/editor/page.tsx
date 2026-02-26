"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Download, Wand2,
    Eye, EyeOff, Palette, LayoutTemplate,
    Plus, Trash2, Sparkles, Loader2, Save, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ResumeTemplate, TEMPLATE_META, TemplateId } from "@/components/resume/templates";
import { defaultResumeData } from "@/types/resume";
import type { ResumeData, ResumeConfig } from "@/types/resume";
import { cn, generateId } from "@/lib/utils";
import { saveResume, isCloudStorage } from "@/lib/resume-storage";

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
    { id: "personal", label: "Personal" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certs" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const ACCENT_COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#10b981",
    "#f59e0b", "#ef4444", "#3b82f6", "#1e3a5f",
];

const FONTS = ["Inter", "Georgia", "Arial", "JetBrains Mono"];

// ─── Component ───────────────────────────────────────────────────────────────
export default function ResumeEditorPage() {
    const [activeTab, setActiveTab] = useState<TabId>("personal");
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern-professional");
    const [showPreview, setShowPreview] = useState(true);
    const [showCustomize, setShowCustomize] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const [resumeId, setResumeId] = useState<string | undefined>(undefined);
    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
    const [config, setConfig] = useState<ResumeConfig>({
        template: "modern-professional",
        accentColor: "#6366f1",
        fontFamily: "Inter",
        fontSize: "md",
        spacing: "normal",
        sections: defaultResumeData.sections,
    });

    const updateData = useCallback((updates: Partial<ResumeData>) => {
        setResumeData((prev) => ({ ...prev, ...updates }));
    }, []);

    const updateConfig = useCallback((updates: Partial<ResumeConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    }, []);

    const handleAIOptimize = async () => {
        setAiLoading(true);
        try {
            const res = await fetch("/api/resume/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "AI optimization failed");
            }
            const optimized = await res.json();
            setResumeData(optimized);
            toast.success("Resume optimized with AI! ✨");
        } catch (err: any) {
            toast.error(err.message || "AI optimization failed. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const res = await fetch("/api/resume/export/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData, config, templateId: selectedTemplate }),
            });
            if (!res.ok) throw new Error("PDF export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${resumeData.personalInfo.fullName || "resume"}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF downloaded!");
        } catch {
            toast.error("PDF export failed. Please try again.");
        }
    };

    const handleDownloadDOCX = async () => {
        try {
            const res = await fetch("/api/resume/export-docx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
            });
            if (!res.ok) throw new Error("DOCX export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${resumeData.personalInfo.fullName || "resume"}_resume.docx`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("DOCX downloaded!");
        } catch {
            toast.error("DOCX export failed. Please try again.");
        }
    };

    const handleSave = async () => {
        setSaveLoading(true);
        setSavedOk(false);
        try {
            const name = resumeData.personalInfo.fullName
                ? `${resumeData.personalInfo.fullName} — ${new Date().toLocaleDateString()}`
                : `Resume — ${new Date().toLocaleDateString()}`;
            const saved = await saveResume({
                id: resumeId,
                name,
                data: resumeData,
                config,
                starred: false,
            });
            setResumeId(saved.id);
            setSavedOk(true);
            const backend = isCloudStorage() ? "Saved to cloud ☁️" : "Saved locally 💾";
            toast.success(backend);
            setTimeout(() => setSavedOk(false), 2500);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] -m-6 md:-m-8 overflow-hidden">
            {/* ── Left Panel: Form ── */}
            <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col glass border-r border-white/5 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                    <Link href="/resume" className="text-white/40 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <span className="text-sm font-semibold text-white flex-1">Resume Editor</span>
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className={cn("p-2 rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/8", showTemplates && "bg-white/8 text-white")}
                        title="Templates"
                    >
                        <LayoutTemplate className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowCustomize(!showCustomize)}
                        className={cn("p-2 rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/8", showCustomize && "bg-white/8 text-white")}
                        title="Customize"
                    >
                        <Palette className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors md:hidden"
                    >
                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {/* Download buttons */}
                    <button
                        onClick={handleDownloadPDF}
                        className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors"
                        title="Download PDF"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownloadDOCX}
                        className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors text-xs font-bold"
                        title="Download DOCX"
                    >
                        .doc
                    </button>
                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            savedOk
                                ? "text-emerald-400 bg-emerald-500/10"
                                : "text-white/50 hover:text-white hover:bg-white/8"
                        )}
                        title={isCloudStorage() ? "Save to cloud" : "Save locally"}
                    >
                        {saveLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : savedOk ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Template picker */}
                <AnimatePresence>
                    {showTemplates && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-b border-white/5 overflow-hidden"
                        >
                            <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar">
                                {TEMPLATE_META.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelectedTemplate(t.id); updateConfig({ template: t.id, accentColor: t.defaultAccent }); }}
                                        className={cn(
                                            "flex-shrink-0 w-24 rounded-xl overflow-hidden border-2 transition-all",
                                            selectedTemplate === t.id ? "border-indigo-500" : "border-transparent"
                                        )}
                                    >
                                        <div className={`h-14 ${t.preview} flex items-center justify-center`}>
                                            <span className="text-white text-xs font-bold text-center px-1 leading-tight">{t.name}</span>
                                        </div>
                                        <div className="bg-white/5 px-1 py-1 text-center">
                                            <span className="text-xs text-white/50">{t.tag}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Customize panel */}
                <AnimatePresence>
                    {showCustomize && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-b border-white/5 overflow-hidden"
                        >
                            <div className="p-4 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-white/60 mb-2">Accent Color</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {ACCENT_COLORS.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => updateConfig({ accentColor: c })}
                                                className={cn("w-7 h-7 rounded-full border-2 transition-all", config.accentColor === c ? "border-white scale-110" : "border-transparent")}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white/60 mb-2">Font</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {FONTS.map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => updateConfig({ fontFamily: f })}
                                                className={cn("text-xs px-3 py-1.5 rounded-lg border transition-all", config.fontFamily === f ? "border-indigo-500 bg-indigo-500/20 text-white" : "border-white/10 text-white/50 hover:border-white/20")}
                                                style={{ fontFamily: f }}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white/60 mb-2">Font Size</p>
                                    <div className="flex gap-2">
                                        {(["sm", "md", "lg"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateConfig({ fontSize: s })}
                                                className={cn("text-xs px-3 py-1.5 rounded-lg border transition-all", config.fontSize === s ? "border-indigo-500 bg-indigo-500/20 text-white" : "border-white/10 text-white/50 hover:border-white/20")}
                                            >
                                                {s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Section tabs */}
                <div className="flex overflow-x-auto no-scrollbar border-b border-white/5">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-shrink-0 px-4 py-3 text-xs font-medium transition-colors border-b-2",
                                activeTab === tab.id
                                    ? "border-indigo-500 text-white"
                                    : "border-transparent text-white/40 hover:text-white/70"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeTab === "personal" && <PersonalInfoForm data={resumeData} onChange={updateData} />}
                    {activeTab === "experience" && <ExperienceForm data={resumeData} onChange={updateData} />}
                    {activeTab === "education" && <EducationForm data={resumeData} onChange={updateData} />}
                    {activeTab === "skills" && <SkillsForm data={resumeData} onChange={updateData} />}
                    {activeTab === "projects" && <ProjectsForm data={resumeData} onChange={updateData} />}
                    {activeTab === "certifications" && <CertificationsForm data={resumeData} onChange={updateData} />}
                </div>

                {/* Bottom actions */}
                <div className="p-4 border-t border-white/5 flex gap-2">
                    <button
                        onClick={handleAIOptimize}
                        disabled={aiLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        AI Optimize
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 glass border border-white/10 hover:border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                </div>
            </div>

            {/* ── Right Panel: Live Preview ── */}
            <div className={cn("flex-1 bg-gray-900/50 overflow-auto p-8 flex justify-center", !showPreview && "hidden md:flex")}>
                <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs text-white/30">Live Preview</span>
                        <span className="text-xs text-white/30">A4 · 794px</span>
                    </div>
                    <div className="shadow-2xl">
                        <ResumeTemplate
                            templateId={selectedTemplate}
                            data={resumeData}
                            config={config}
                            scale={0.75}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Form Sections ────────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">{label}</label>
            {children}
        </div>
    );
}

function Input({ value, onChange, placeholder, type = "text" }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-glass w-full text-sm py-2"
        />
    );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="input-glass w-full text-sm py-2 resize-none"
        />
    );
}

function PersonalInfoForm({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const p = data.personalInfo;
    const set = (key: string, val: string) => onChange({ personalInfo: { ...p, [key]: val } });

    return (
        <div className="space-y-3">
            <FieldGroup label="Full Name"><Input value={p.fullName} onChange={(v) => set("fullName", v)} placeholder="John Doe" /></FieldGroup>
            <FieldGroup label="Email"><Input value={p.email} onChange={(v) => set("email", v)} placeholder="john@example.com" type="email" /></FieldGroup>
            <FieldGroup label="Phone"><Input value={p.phone} onChange={(v) => set("phone", v)} placeholder="+1 (555) 000-0000" /></FieldGroup>
            <FieldGroup label="Location"><Input value={p.location} onChange={(v) => set("location", v)} placeholder="San Francisco, CA" /></FieldGroup>
            <FieldGroup label="LinkedIn"><Input value={p.linkedin || ""} onChange={(v) => set("linkedin", v)} placeholder="linkedin.com/in/johndoe" /></FieldGroup>
            <FieldGroup label="GitHub"><Input value={p.github || ""} onChange={(v) => set("github", v)} placeholder="github.com/johndoe" /></FieldGroup>
            <FieldGroup label="Website"><Input value={p.website || ""} onChange={(v) => set("website", v)} placeholder="johndoe.dev" /></FieldGroup>
            <FieldGroup label="Professional Summary">
                <Textarea value={p.summary} onChange={(v) => set("summary", v)} placeholder="Brief professional summary..." rows={4} />
            </FieldGroup>
        </div>
    );
}

function ExperienceForm({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const exp = data.experience;

    const addExp = () => onChange({
        experience: [...exp, {
            id: generateId(), company: "", position: "", location: "",
            startDate: "", endDate: "", current: false, description: [""],
        }]
    });

    const removeExp = (id: string) => onChange({ experience: exp.filter((e) => e.id !== id) });

    const updateExp = (id: string, key: string, val: unknown) =>
        onChange({ experience: exp.map((e) => e.id === id ? { ...e, [key]: val } : e) });

    const addBullet = (id: string) =>
        onChange({ experience: exp.map((e) => e.id === id ? { ...e, description: [...e.description, ""] } : e) });

    const updateBullet = (id: string, idx: number, val: string) =>
        onChange({ experience: exp.map((e) => e.id === id ? { ...e, description: e.description.map((b, i) => i === idx ? val : b) } : e) });

    const removeBullet = (id: string, idx: number) =>
        onChange({ experience: exp.map((e) => e.id === id ? { ...e, description: e.description.filter((_, i) => i !== idx) } : e) });

    return (
        <div className="space-y-4">
            {exp.map((e) => (
                <div key={e.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white/60">Experience</span>
                        <button onClick={() => removeExp(e.id)} className="text-red-400/60 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <FieldGroup label="Company"><Input value={e.company} onChange={(v) => updateExp(e.id, "company", v)} placeholder="Acme Corp" /></FieldGroup>
                    <FieldGroup label="Position"><Input value={e.position} onChange={(v) => updateExp(e.id, "position", v)} placeholder="Senior Engineer" /></FieldGroup>
                    <div className="grid grid-cols-2 gap-2">
                        <FieldGroup label="Start Date"><Input value={e.startDate} onChange={(v) => updateExp(e.id, "startDate", v)} placeholder="2022-01" /></FieldGroup>
                        <FieldGroup label="End Date">
                            <Input value={e.endDate} onChange={(v) => updateExp(e.id, "endDate", v)} placeholder="2024-01" />
                        </FieldGroup>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                        <input type="checkbox" checked={e.current} onChange={(ev) => updateExp(e.id, "current", ev.target.checked)} className="rounded" />
                        Currently working here
                    </label>
                    <div>
                        <p className="text-xs font-medium text-white/50 mb-2">Bullet Points</p>
                        <div className="space-y-2">
                            {e.description.map((b, i) => (
                                <div key={i} className="flex gap-2">
                                    <textarea
                                        value={b}
                                        onChange={(ev) => updateBullet(e.id, i, ev.target.value)}
                                        placeholder="Led a team of 5 engineers to deliver..."
                                        rows={2}
                                        className="input-glass flex-1 text-xs py-1.5 resize-none"
                                    />
                                    <button onClick={() => removeBullet(e.id, i)} className="text-red-400/40 hover:text-red-400 transition-colors self-start mt-1">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addBullet(e.id)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add bullet
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addExp} className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Experience
            </button>
        </div>
    );
}

function EducationForm({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const edu = data.education;

    const addEdu = () => onChange({
        education: [...edu, { id: generateId(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", honors: [] }]
    });
    const removeEdu = (id: string) => onChange({ education: edu.filter((e) => e.id !== id) });
    const updateEdu = (id: string, key: string, val: string) =>
        onChange({ education: edu.map((e) => e.id === id ? { ...e, [key]: val } : e) });

    return (
        <div className="space-y-4">
            {edu.map((e) => (
                <div key={e.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white/60">Education</span>
                        <button onClick={() => removeEdu(e.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <FieldGroup label="Institution"><Input value={e.institution} onChange={(v) => updateEdu(e.id, "institution", v)} placeholder="MIT" /></FieldGroup>
                    <FieldGroup label="Degree"><Input value={e.degree} onChange={(v) => updateEdu(e.id, "degree", v)} placeholder="Bachelor of Science" /></FieldGroup>
                    <FieldGroup label="Field of Study"><Input value={e.field} onChange={(v) => updateEdu(e.id, "field", v)} placeholder="Computer Science" /></FieldGroup>
                    <div className="grid grid-cols-2 gap-2">
                        <FieldGroup label="Start Date"><Input value={e.startDate} onChange={(v) => updateEdu(e.id, "startDate", v)} placeholder="2018-09" /></FieldGroup>
                        <FieldGroup label="End Date"><Input value={e.endDate} onChange={(v) => updateEdu(e.id, "endDate", v)} placeholder="2022-05" /></FieldGroup>
                    </div>
                    <FieldGroup label="GPA (optional)"><Input value={e.gpa || ""} onChange={(v) => updateEdu(e.id, "gpa", v)} placeholder="3.8" /></FieldGroup>
                </div>
            ))}
            <button onClick={addEdu} className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Education
            </button>
        </div>
    );
}

function SkillsForm({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const skills = data.skills;

    const addGroup = () => onChange({ skills: [...skills, { id: generateId(), category: "", items: [] }] });
    const removeGroup = (id: string) => onChange({ skills: skills.filter((s) => s.id !== id) });
    const updateGroup = (id: string, key: string, val: unknown) =>
        onChange({ skills: skills.map((s) => s.id === id ? { ...s, [key]: val } : s) });

    return (
        <div className="space-y-4">
            {skills.map((s) => (
                <div key={s.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white/60">Skill Group</span>
                        <button onClick={() => removeGroup(s.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <FieldGroup label="Category"><Input value={s.category} onChange={(v) => updateGroup(s.id, "category", v)} placeholder="Frontend, Backend, Tools..." /></FieldGroup>
                    <FieldGroup label="Skills (comma separated)">
                        <Input
                            value={s.items.join(", ")}
                            onChange={(v) => updateGroup(s.id, "items", v.split(",").map((x) => x.trim()).filter(Boolean))}
                            placeholder="React, TypeScript, Node.js"
                        />
                    </FieldGroup>
                </div>
            ))}
            <button onClick={addGroup} className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Skill Group
            </button>
        </div>
    );
}

function ProjectsForm({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const projects = data.projects;

    const addProject = () => onChange({ projects: [...projects, { id: generateId(), name: "", description: "", technologies: [], url: "", github: "" }] });
    const removeProject = (id: string) => onChange({ projects: projects.filter((p) => p.id !== id) });
    const updateProject = (id: string, key: string, val: unknown) =>
        onChange({ projects: projects.map((p) => p.id === id ? { ...p, [key]: val } : p) });

    return (
        <div className="space-y-4">
            {projects.map((p) => (
                <div key={p.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white/60">Project</span>
                        <button onClick={() => removeProject(p.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <FieldGroup label="Project Name"><Input value={p.name} onChange={(v) => updateProject(p.id, "name", v)} placeholder="AI Resume Builder" /></FieldGroup>
                    <FieldGroup label="Description"><Textarea value={p.description} onChange={(v) => updateProject(p.id, "description", v)} placeholder="Brief description..." rows={2} /></FieldGroup>
                    <FieldGroup label="Technologies (comma separated)">
                        <Input value={p.technologies.join(", ")} onChange={(v) => updateProject(p.id, "technologies", v.split(",").map((x) => x.trim()).filter(Boolean))} placeholder="Next.js, TypeScript, MongoDB" />
                    </FieldGroup>
                    <div className="grid grid-cols-2 gap-2">
                        <FieldGroup label="Live URL"><Input value={p.url || ""} onChange={(v) => updateProject(p.id, "url", v)} placeholder="https://..." /></FieldGroup>
                        <FieldGroup label="GitHub"><Input value={p.github || ""} onChange={(v) => updateProject(p.id, "github", v)} placeholder="github.com/..." /></FieldGroup>
                    </div>
                </div>
            ))}
            <button onClick={addProject} className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Project
            </button>
        </div>
    );
}

function CertificationsForm({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const certs = data.certifications;

    const addCert = () => onChange({ certifications: [...certs, { id: generateId(), name: "", issuer: "", date: "", url: "" }] });
    const removeCert = (id: string) => onChange({ certifications: certs.filter((c) => c.id !== id) });
    const updateCert = (id: string, key: string, val: string) =>
        onChange({ certifications: certs.map((c) => c.id === id ? { ...c, [key]: val } : c) });

    return (
        <div className="space-y-4">
            {certs.map((c) => (
                <div key={c.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white/60">Certification</span>
                        <button onClick={() => removeCert(c.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <FieldGroup label="Name"><Input value={c.name} onChange={(v) => updateCert(c.id, "name", v)} placeholder="AWS Solutions Architect" /></FieldGroup>
                    <FieldGroup label="Issuer"><Input value={c.issuer} onChange={(v) => updateCert(c.id, "issuer", v)} placeholder="Amazon Web Services" /></FieldGroup>
                    <FieldGroup label="Date"><Input value={c.date} onChange={(v) => updateCert(c.id, "date", v)} placeholder="2024-03" /></FieldGroup>
                    <FieldGroup label="URL (optional)"><Input value={c.url || ""} onChange={(v) => updateCert(c.id, "url", v)} placeholder="https://..." /></FieldGroup>
                </div>
            ))}
            <button onClick={addCert} className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Certification
            </button>
        </div>
    );
}
