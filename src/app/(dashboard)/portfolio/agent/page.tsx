"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, ChevronRight, Wand2, User, Link2,
    Code2, FolderOpen, Palette, Loader2, Sparkles,
    CheckCircle2, Plus, Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PORTFOLIO_TEMPLATE_META } from "@/types/portfolio";
import type { WizardData, PortfolioStyle } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const defaultWizard: WizardData = {
    step1: { name: "", title: "", bio: "", location: "", email: "" },
    step2: { github: "", linkedin: "", website: "" },
    step3: { skills: "", experience: "2", specialization: "" },
    step4: { projects: [{ name: "", description: "", tech: "", url: "" }] },
    step5: { style: "developer-dark", colorScheme: "#6366f1", tone: "professional" },
};

const STEPS = [
    { id: 1, label: "About You", icon: User },
    { id: 2, label: "Links", icon: Link2 },
    { id: 3, label: "Skills", icon: Code2 },
    { id: 4, label: "Projects", icon: FolderOpen },
    { id: 5, label: "Style", icon: Palette },
];

const TONES = [
    { id: "professional", label: "Professional", desc: "Clean and corporate" },
    { id: "creative", label: "Creative", desc: "Bold and expressive" },
    { id: "minimal", label: "Minimal", desc: "Simple and elegant" },
] as const;

export default function PortfolioAgentPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>(defaultWizard);
    const [generating, setGenerating] = useState(false);
    const router = useRouter();

    const updateStep1 = (key: keyof WizardData["step1"], val: string) =>
        setData((d) => ({ ...d, step1: { ...d.step1, [key]: val } }));
    const updateStep2 = (key: keyof WizardData["step2"], val: string) =>
        setData((d) => ({ ...d, step2: { ...d.step2, [key]: val } }));
    const updateStep3 = (key: keyof WizardData["step3"], val: string) =>
        setData((d) => ({ ...d, step3: { ...d.step3, [key]: val } }));
    const updateStep5 = (key: keyof WizardData["step5"], val: string) =>
        setData((d) => ({ ...d, step5: { ...d.step5, [key]: val as PortfolioStyle } }));

    const addProject = () =>
        setData((d) => ({
            ...d,
            step4: { projects: [...d.step4.projects, { name: "", description: "", tech: "", url: "" }] },
        }));
    const removeProject = (i: number) =>
        setData((d) => ({
            ...d,
            step4: { projects: d.step4.projects.filter((_, idx) => idx !== i) },
        }));
    const updateProject = (i: number, key: string, val: string) =>
        setData((d) => ({
            ...d,
            step4: {
                projects: d.step4.projects.map((p, idx) => idx === i ? { ...p, [key]: val } : p),
            },
        }));

    const handleGenerate = async () => {
        if (!data.step1.name || !data.step1.title) {
            toast.error("Please fill in at least your name and title");
            setStep(1);
            return;
        }
        setGenerating(true);
        try {
            const res = await fetch("/api/portfolio/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Generation failed");
            const result = await res.json();
            // Store in sessionStorage and redirect to preview
            sessionStorage.setItem("generatedPortfolio", JSON.stringify(result));
            toast.success("Portfolio generated! ✨");
            router.push("/portfolio/preview");
        } catch {
            toast.error("Generation failed. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const canNext = () => {
        if (step === 1) return data.step1.name.trim() && data.step1.title.trim();
        return true;
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Link href="/portfolio" className="text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Portfolio Wizard</h1>
                    <p className="text-white/50 text-sm">Answer a few questions to generate your portfolio</p>
                </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                        <button
                            onClick={() => step > s.id && setStep(s.id)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                step === s.id
                                    ? "bg-indigo-600 text-white"
                                    : step > s.id
                                        ? "bg-emerald-500/20 text-emerald-400 cursor-pointer hover:bg-emerald-500/30"
                                        : "bg-white/5 text-white/30 cursor-default"
                            )}
                        >
                            {step > s.id ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                                <s.icon className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">{s.label}</span>
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={cn("h-px w-6 transition-colors", step > s.id ? "bg-emerald-500/40" : "bg-white/10")} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="glass rounded-2xl p-7 mb-6"
                >
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Tell us about yourself</h2>
                            <Field label="Full Name *">
                                <Input value={data.step1.name} onChange={(v) => updateStep1("name", v)} placeholder="Alex Johnson" />
                            </Field>
                            <Field label="Professional Title *">
                                <Input value={data.step1.title} onChange={(v) => updateStep1("title", v)} placeholder="Full-Stack Developer" />
                            </Field>
                            <Field label="Bio / Tagline">
                                <Textarea value={data.step1.bio} onChange={(v) => updateStep1("bio", v)} placeholder="I build fast, beautiful web apps with React and Node.js..." rows={3} />
                            </Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Location">
                                    <Input value={data.step1.location} onChange={(v) => updateStep1("location", v)} placeholder="San Francisco, CA" />
                                </Field>
                                <Field label="Email">
                                    <Input value={data.step1.email} onChange={(v) => updateStep1("email", v)} placeholder="alex@example.com" type="email" />
                                </Field>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Your links & profiles</h2>
                            <Field label="GitHub URL">
                                <Input value={data.step2.github} onChange={(v) => updateStep2("github", v)} placeholder="https://github.com/alexjohnson" />
                            </Field>
                            <Field label="LinkedIn URL">
                                <Input value={data.step2.linkedin} onChange={(v) => updateStep2("linkedin", v)} placeholder="https://linkedin.com/in/alexjohnson" />
                            </Field>
                            <Field label="Personal Website">
                                <Input value={data.step2.website} onChange={(v) => updateStep2("website", v)} placeholder="https://alexjohnson.dev" />
                            </Field>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Skills & experience</h2>
                            <Field label="Skills (comma separated)">
                                <Textarea
                                    value={data.step3.skills}
                                    onChange={(v) => updateStep3("skills", v)}
                                    placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS..."
                                    rows={3}
                                />
                            </Field>
                            <Field label="Years of Experience">
                                <select
                                    value={data.step3.experience}
                                    onChange={(e) => updateStep3("experience", e.target.value)}
                                    className="input-glass w-full text-sm"
                                >
                                    {["0-1", "1", "2", "3", "4", "5", "6", "7", "8", "10+"].map((y) => (
                                        <option key={y} value={y} className="bg-gray-900">{y} year{y !== "1" ? "s" : ""}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Specialization / Focus Area">
                                <Input value={data.step3.specialization} onChange={(v) => updateStep3("specialization", v)} placeholder="Frontend, Backend, Full-Stack, ML, DevOps..." />
                            </Field>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white mb-4">Your projects</h2>
                            {data.step4.projects.map((p, i) => (
                                <div key={i} className="bg-white/3 rounded-xl p-4 space-y-3 border border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-white/50">Project {i + 1}</span>
                                        {data.step4.projects.length > 1 && (
                                            <button onClick={() => removeProject(i)} className="text-red-400/50 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <Field label="Project Name">
                                        <Input value={p.name} onChange={(v) => updateProject(i, "name", v)} placeholder="AI Resume Builder" />
                                    </Field>
                                    <Field label="Description">
                                        <Textarea value={p.description} onChange={(v) => updateProject(i, "description", v)} placeholder="What does it do? What problem does it solve?" rows={2} />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Tech Stack">
                                            <Input value={p.tech} onChange={(v) => updateProject(i, "tech", v)} placeholder="Next.js, Supabase" />
                                        </Field>
                                        <Field label="URL (optional)">
                                            <Input value={p.url} onChange={(v) => updateProject(i, "url", v)} placeholder="https://..." />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                            {data.step4.projects.length < 6 && (
                                <button onClick={addProject} className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Project
                                </button>
                            )}
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Choose your style</h2>
                            <div>
                                <p className="text-xs font-medium text-white/50 mb-3">Template</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {PORTFOLIO_TEMPLATE_META.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => updateStep5("style", t.id)}
                                            className={cn(
                                                "rounded-xl overflow-hidden border-2 transition-all",
                                                data.step5.style === t.id ? "border-indigo-500" : "border-transparent"
                                            )}
                                        >
                                            <div className={`h-20 ${t.preview} flex items-center justify-center`}>
                                                <span className="text-white text-xs font-bold text-center px-2 leading-tight">{t.name}</span>
                                            </div>
                                            <div className="bg-white/5 py-1.5 text-center">
                                                <span className="text-xs text-white/50">{t.tag}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-white/50 mb-3">Tone</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {TONES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setData((d) => ({ ...d, step5: { ...d.step5, tone: t.id } }))}
                                            className={cn(
                                                "p-3 rounded-xl border text-left transition-all",
                                                data.step5.tone === t.id
                                                    ? "border-indigo-500 bg-indigo-500/10"
                                                    : "border-white/10 hover:border-white/20"
                                            )}
                                        >
                                            <p className="text-xs font-semibold text-white">{t.label}</p>
                                            <p className="text-xs text-white/40 mt-0.5">{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {step < 5 ? (
                    <button
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!canNext()}
                        className="btn-glow flex items-center gap-2 py-2.5 px-6 disabled:opacity-50"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="btn-glow flex items-center gap-2 py-2.5 px-6 disabled:opacity-50"
                    >
                        {generating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Generate Portfolio</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Shared form components ───────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">{label}</label>
            {children}
        </div>
    );
}
function Input({ value, onChange, placeholder, type = "text" }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} className="input-glass w-full text-sm" />
    );
}
function Textarea({ value, onChange, placeholder, rows = 3 }: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
    return (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} rows={rows} className="input-glass w-full text-sm resize-none" />
    );
}
