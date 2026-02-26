"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft, Eye, EyeOff, Save, Download,
    Globe, User, Briefcase, Code2, Mail,
    Plus, Trash2, Sparkles, Loader2, ExternalLink, Rocket, Check
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { PORTFOLIO_TEMPLATE_META } from "@/types/portfolio";
import type { PortfolioData, PortfolioStyle } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { savePortfolio, getPortfolio, isCloudStorage } from "@/lib/portfolio-storage";

// ─── Default data ─────────────────────────────────────────────────────────────
const defaultData: PortfolioData = {
    personalInfo: {
        name: "Alex Johnson",
        title: "Full-Stack Developer",
        bio: "I build fast, beautiful web applications with React and Node.js. Passionate about clean code and great user experiences.",
        email: "alex@example.com",
        location: "San Francisco, CA",
        github: "https://github.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
    },
    projects: [
        {
            id: "1",
            name: "AI Resume Builder",
            description: "An AI-powered resume builder that generates ATS-optimized resumes.",
            technologies: ["Next.js", "TypeScript", "Gemini AI"],
            url: "https://resumeai.dev",
            github: "https://github.com/alex/resume-ai",
            featured: true,
        },
    ],
    skills: [
        { id: "1", category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
        { id: "2", category: "Backend", items: ["Node.js", "PostgreSQL", "Supabase", "REST APIs"] },
    ],
    experience: [
        {
            id: "1",
            company: "TechCorp Inc.",
            role: "Senior Frontend Developer",
            startDate: "2022-01",
            endDate: "",
            current: true,
            description: "Led frontend development for a SaaS platform serving 50k+ users.",
        },
    ],
    style: "developer-dark",
    sections: {
        showAbout: true,
        showProjects: true,
        showSkills: true,
        showExperience: true,
        showContact: true,
    },
};

const SECTIONS = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "projects", label: "Projects", icon: Globe },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact & Links", icon: Mail },
];

// ─── Preview renderer ─────────────────────────────────────────────────────────
function PortfolioPreview({ data, scale = 1 }: { data: PortfolioData; scale?: number }) {
    const template = PORTFOLIO_TEMPLATE_META.find((t) => t.id === data.style) ?? PORTFOLIO_TEMPLATE_META[0];
    const accent = template.accent;
    const isDark = data.style !== "minimal-light";

    return (
        <div
            style={{
                width: 1200,
                minHeight: 900,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                fontFamily: "system-ui, sans-serif",
                backgroundColor: isDark ? (data.style === "developer-dark" ? "#0d1117" : "#0f0f1a") : "#ffffff",
                color: isDark ? "#e6edf3" : "#0f172a",
            }}
        >
            {/* Hero */}
            <div
                style={{
                    padding: "80px 80px 60px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    background: data.style === "developer-dark"
                        ? "linear-gradient(135deg, #0d1117 0%, #161b22 100%)"
                        : data.style === "agency-pro"
                            ? `linear-gradient(135deg, ${accent}22 0%, transparent 60%)`
                            : "transparent",
                }}
            >
                {data.style === "developer-dark" && (
                    <div style={{ fontFamily: "monospace", color: accent, fontSize: 13, marginBottom: 16, opacity: 0.7 }}>
                        {">"} whoami
                    </div>
                )}
                <h1 style={{ fontSize: 52, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
                    {data.personalInfo.name || "Your Name"}
                </h1>
                <p style={{ fontSize: 22, color: accent, fontWeight: 600, marginTop: 8, marginBottom: 16 }}>
                    {data.personalInfo.title || "Your Title"}
                </p>
                <p style={{ fontSize: 16, opacity: 0.6, maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
                    {data.personalInfo.bio}
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
                    {data.personalInfo.github && (
                        <span style={{ fontSize: 13, opacity: 0.5 }}>⌥ {data.personalInfo.github.replace("https://", "")}</span>
                    )}
                    {data.personalInfo.email && (
                        <span style={{ fontSize: 13, opacity: 0.5 }}>✉ {data.personalInfo.email}</span>
                    )}
                    {data.personalInfo.location && (
                        <span style={{ fontSize: 13, opacity: 0.5 }}>⌖ {data.personalInfo.location}</span>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", gap: 0 }}>
                {/* Main content */}
                <div style={{ flex: 1, padding: "48px 80px" }}>
                    {/* Projects */}
                    {data.sections.showProjects && data.projects.length > 0 && (
                        <div style={{ marginBottom: 48 }}>
                            <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, marginBottom: 24 }}>
                                Projects
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {data.projects.map((p) => (
                                    <div key={p.id} style={{
                                        padding: 20,
                                        borderRadius: 12,
                                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                    }}>
                                        <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{p.name}</p>
                                        <p style={{ fontSize: 13, opacity: 0.5, marginTop: 6, lineHeight: 1.5 }}>{p.description}</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                                            {p.technologies.map((t) => (
                                                <span key={t} style={{
                                                    fontSize: 11, padding: "2px 8px", borderRadius: 4,
                                                    background: `${accent}22`, color: accent, fontWeight: 600,
                                                }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {data.sections.showExperience && data.experience.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, marginBottom: 24 }}>
                                Experience
                            </h2>
                            {data.experience.map((e) => (
                                <div key={e.id} style={{ marginBottom: 24, paddingLeft: 16, borderLeft: `2px solid ${accent}44` }}>
                                    <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{e.role}</p>
                                    <p style={{ fontSize: 13, color: accent, marginTop: 2 }}>{e.company}</p>
                                    <p style={{ fontSize: 12, opacity: 0.4, marginTop: 2 }}>
                                        {e.startDate} — {e.current ? "Present" : e.endDate}
                                    </p>
                                    <p style={{ fontSize: 13, opacity: 0.6, marginTop: 8, lineHeight: 1.6 }}>{e.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{
                    width: 280, flexShrink: 0, padding: "48px 40px 48px 0",
                    borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}>
                    {/* Skills */}
                    {data.sections.showSkills && data.skills.length > 0 && (
                        <div style={{ marginBottom: 36 }}>
                            <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, marginBottom: 16 }}>
                                Skills
                            </h2>
                            {data.skills.map((g) => (
                                <div key={g.id} style={{ marginBottom: 16 }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, marginBottom: 8 }}>{g.category}</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {g.items.map((s) => (
                                            <span key={s} style={{
                                                fontSize: 11, padding: "3px 8px", borderRadius: 4,
                                                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                                                opacity: 0.7,
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main editor ──────────────────────────────────────────────────────────────
export default function PortfolioEditorPage() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Actually need useRouter for redirecting after first save
    const initialTemplate = (searchParams.get("template") as PortfolioStyle) || "developer-dark";
    const portfolioId = searchParams.get("id");

    const [data, setData] = useState<PortfolioData>({ ...defaultData, style: initialTemplate });
    const [activeSection, setActiveSection] = useState("personal");
    const [showPreview, setShowPreview] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!portfolioId);
    const [deployStep, setDeployStep] = useState(0); // 0: none, 1: connecting, 2: building, 3: success
    const cloudStorage = isCloudStorage();

    // Load existing portfolio if ID provided
    useEffect(() => {
        if (portfolioId) {
            getPortfolio(portfolioId).then((p) => {
                if (p) {
                    setData(p.data);
                }
                setLoading(false);
            });
        }
    }, [portfolioId]);

    const updatePersonal = useCallback((key: keyof PortfolioData["personalInfo"], val: string) => {
        setData((d) => ({ ...d, personalInfo: { ...d.personalInfo, [key]: val } }));
    }, []);

    const addProject = () => {
        setData((d) => ({
            ...d,
            projects: [...d.projects, {
                id: Date.now().toString(), name: "", description: "",
                technologies: [], featured: false,
            }],
        }));
    };

    const removeProject = (id: string) =>
        setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));

    const updateProject = (id: string, key: keyof PortfolioData["projects"][0], val: string | boolean | string[]) =>
        setData((d) => ({
            ...d,
            projects: d.projects.map((p) => p.id === id ? { ...p, [key]: val } : p),
        }));

    const addSkillGroup = () =>
        setData((d) => ({
            ...d,
            skills: [...d.skills, { id: Date.now().toString(), category: "New Category", items: [] }],
        }));

    const removeSkillGroup = (id: string) =>
        setData((d) => ({ ...d, skills: d.skills.filter((s) => s.id !== id) }));

    const updateSkillGroup = (id: string, key: "category" | "items", val: string | string[]) =>
        setData((d) => ({
            ...d,
            skills: d.skills.map((s) => s.id === id ? { ...s, [key]: val } : s),
        }));

    const addExperience = () =>
        setData((d) => ({
            ...d,
            experience: [...d.experience, {
                id: Date.now().toString(), company: "", role: "",
                startDate: "", endDate: "", current: false, description: "",
            }],
        }));

    const removeExperience = (id: string) =>
        setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));

    const updateExperience = (id: string, key: keyof PortfolioData["experience"][0], val: string | boolean) =>
        setData((d) => ({
            ...d,
            experience: d.experience.map((e) => e.id === id ? { ...e, [key]: val } : e),
        }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const saved = await savePortfolio({
                id: portfolioId || undefined,
                data,
                name: data.personalInfo.name,
                templateId: data.style,
            });

            toast.success(cloudStorage ? "Synced to cloud ☁️" : "Saved locally 💾");

            // If it was a new portfolio, add the ID to the URL
            if (!portfolioId) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("id", saved.id);
                window.history.replaceState(null, "", `?${params.toString()}`);
            }
        } catch (err) {
            toast.error("Failed to save portfolio");
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = () => {
        sessionStorage.setItem("previewPortfolioData", JSON.stringify(data));
        window.open("/portfolio/view", "_blank");
    };

    const previewScale = showPreview ? 0.42 : 0;

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/portfolio" className="text-white/40 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">Portfolio Editor</h1>
                        <p className="text-white/40 text-xs capitalize">{data.style.replace("-", " ")} template</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Template switcher */}
                    <div className="flex gap-1 glass rounded-xl p-1">
                        {PORTFOLIO_TEMPLATE_META.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setData((d) => ({ ...d, style: t.id }))}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    data.style === t.id ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white"
                                )}
                            >
                                {t.name.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Preview
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 py-2 px-3 glass rounded-xl text-sm text-white/60 hover:text-white transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                    <button
                        onClick={() => toast.info("✨ Source code export is currently a Pro feature.")}
                        className="flex items-center gap-2 py-2 px-3 glass rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => {
                                setDeployStep(1);
                                // Simulate progress
                                setTimeout(() => setDeployStep(2), 2000);
                                setTimeout(() => setDeployStep(3), 5000);
                            }}
                            className="btn-glow flex items-center gap-2 py-2 px-4 text-sm"
                        >
                            <Rocket className="w-4 h-4" /> Deploy
                        </button>
                        <span className="text-[10px] text-white/30 mt-1 italic tracking-tight">Feature under testing</span>
                    </div>
                </div>
            </div>

            {/* Mock Deploy Modal */}
            <AnimatePresence>
                {deployStep > 0 && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => deployStep === 3 && setDeployStep(0)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: deployStep === 1 ? "30%" : deployStep === 2 ? "70%" : "100%" }}
                                />
                            </div>

                            <button
                                onClick={() => setDeployStep(0)}
                                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>

                            <div className="text-center">
                                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                                    {deployStep < 3 ? (
                                        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <Check className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">
                                    {deployStep === 1 && "Connecting to Vercel..."}
                                    {deployStep === 2 && "Building your Portfolio..."}
                                    {deployStep === 3 && "Success! Site is Live"}
                                </h3>
                                <p className="text-white/50 text-sm mb-8">
                                    {deployStep === 1 && "Authenticating with your Vercel account and creating a new project."}
                                    {deployStep === 2 && "Optimizing images, compiling Tailwind, and generating static pages."}
                                    {deployStep === 3 && "Your professional portfolio has been deployed to a production-ready edge network."}
                                </p>

                                {deployStep === 3 ? (
                                    <div className="space-y-3">
                                        <a
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="w-full btn-glow flex items-center justify-center gap-2 py-3 text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Visit Site
                                        </a>
                                        <button
                                            onClick={() => setDeployStep(0)}
                                            className="w-full py-3 text-sm text-white/40 hover:text-white transition-colors"
                                        >
                                            Return to Editor
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-bold tracking-widest uppercase italic">
                                        <Sparkles className="w-3 h-3" /> PREPARING PRODUCTION BUILD
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Editor + Preview */}
            <div className="flex-1 min-h-0 flex gap-4">
                {/* Left panel — form */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-2">
                    {/* Section tabs */}
                    <div className="glass rounded-xl p-1 flex flex-col gap-0.5">
                        {SECTIONS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                                    activeSection === s.id
                                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <s.icon className="w-4 h-4 flex-shrink-0" />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Section content */}
                    <div className="flex-1 glass rounded-xl p-4 overflow-y-auto no-scrollbar">
                        {activeSection === "personal" && (
                            <div className="space-y-3">
                                <Field label="Full Name">
                                    <Input value={data.personalInfo.name} onChange={(v) => updatePersonal("name", v)} placeholder="Alex Johnson" />
                                </Field>
                                <Field label="Title / Role">
                                    <Input value={data.personalInfo.title} onChange={(v) => updatePersonal("title", v)} placeholder="Full-Stack Developer" />
                                </Field>
                                <Field label="Bio">
                                    <Textarea value={data.personalInfo.bio} onChange={(v) => updatePersonal("bio", v)} placeholder="Brief bio..." rows={4} />
                                </Field>
                                <Field label="Location">
                                    <Input value={data.personalInfo.location || ""} onChange={(v) => updatePersonal("location", v)} placeholder="San Francisco, CA" />
                                </Field>
                            </div>
                        )}

                        {activeSection === "contact" && (
                            <div className="space-y-3">
                                <Field label="Email">
                                    <Input value={data.personalInfo.email} onChange={(v) => updatePersonal("email", v)} placeholder="alex@example.com" type="email" />
                                </Field>
                                <Field label="GitHub">
                                    <Input value={data.personalInfo.github || ""} onChange={(v) => updatePersonal("github", v)} placeholder="https://github.com/..." />
                                </Field>
                                <Field label="LinkedIn">
                                    <Input value={data.personalInfo.linkedin || ""} onChange={(v) => updatePersonal("linkedin", v)} placeholder="https://linkedin.com/in/..." />
                                </Field>
                                <Field label="Website">
                                    <Input value={data.personalInfo.website || ""} onChange={(v) => updatePersonal("website", v)} placeholder="https://yoursite.dev" />
                                </Field>
                            </div>
                        )}

                        {activeSection === "projects" && (
                            <div className="space-y-3">
                                {data.projects.map((p, i) => (
                                    <div key={p.id} className="bg-white/3 rounded-xl p-3 space-y-2 border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-white/40">Project {i + 1}</span>
                                            <button onClick={() => removeProject(p.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <Field label="Name">
                                            <Input value={p.name} onChange={(v) => updateProject(p.id, "name", v)} placeholder="Project name" />
                                        </Field>
                                        <Field label="Description">
                                            <Textarea value={p.description} onChange={(v) => updateProject(p.id, "description", v)} placeholder="What it does..." rows={2} />
                                        </Field>
                                        <Field label="Technologies (comma separated)">
                                            <Input
                                                value={p.technologies.join(", ")}
                                                onChange={(v) => updateProject(p.id, "technologies", v.split(",").map((s) => s.trim()).filter(Boolean))}
                                                placeholder="React, Node.js, PostgreSQL"
                                            />
                                        </Field>
                                        <Field label="Live URL">
                                            <Input value={p.url || ""} onChange={(v) => updateProject(p.id, "url", v)} placeholder="https://..." />
                                        </Field>
                                    </div>
                                ))}
                                <button onClick={addProject} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-white/40 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Project
                                </button>
                            </div>
                        )}

                        {activeSection === "skills" && (
                            <div className="space-y-3">
                                {data.skills.map((g) => (
                                    <div key={g.id} className="bg-white/3 rounded-xl p-3 space-y-2 border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <Field label="Category">
                                                <Input value={g.category} onChange={(v) => updateSkillGroup(g.id, "category", v)} placeholder="Frontend" />
                                            </Field>
                                            <button onClick={() => removeSkillGroup(g.id)} className="text-red-400/50 hover:text-red-400 transition-colors ml-2 mt-4">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <Field label="Skills (comma separated)">
                                            <Input
                                                value={g.items.join(", ")}
                                                onChange={(v) => updateSkillGroup(g.id, "items", v.split(",").map((s) => s.trim()).filter(Boolean))}
                                                placeholder="React, TypeScript, Tailwind"
                                            />
                                        </Field>
                                    </div>
                                ))}
                                <button onClick={addSkillGroup} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-white/40 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Skill Group
                                </button>
                            </div>
                        )}

                        {activeSection === "experience" && (
                            <div className="space-y-3">
                                {data.experience.map((e, i) => (
                                    <div key={e.id} className="bg-white/3 rounded-xl p-3 space-y-2 border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-white/40">Job {i + 1}</span>
                                            <button onClick={() => removeExperience(e.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <Field label="Company">
                                            <Input value={e.company} onChange={(v) => updateExperience(e.id, "company", v)} placeholder="Company name" />
                                        </Field>
                                        <Field label="Role">
                                            <Input value={e.role} onChange={(v) => updateExperience(e.id, "role", v)} placeholder="Senior Developer" />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Field label="Start Date">
                                                <Input value={e.startDate} onChange={(v) => updateExperience(e.id, "startDate", v)} placeholder="2022-01" />
                                            </Field>
                                            <Field label="End Date">
                                                <Input value={e.endDate} onChange={(v) => updateExperience(e.id, "endDate", v)} placeholder="2024-06" disabled={e.current} />
                                            </Field>
                                        </div>
                                        <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
                                            <input type="checkbox" checked={e.current} onChange={(ev) => updateExperience(e.id, "current", ev.target.checked)} className="rounded" />
                                            Currently working here
                                        </label>
                                        <Field label="Description">
                                            <Textarea value={e.description} onChange={(v) => updateExperience(e.id, "description", v)} placeholder="What you did..." rows={3} />
                                        </Field>
                                    </div>
                                ))}
                                <button onClick={addExperience} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-white/40 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Experience
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel — live preview */}
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 glass rounded-2xl overflow-hidden border border-white/10 flex flex-col"
                    >
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/3 flex-shrink-0">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                            <div className="flex-1 mx-3 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 font-mono">
                                yourportfolio.com
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-white/20" />
                        </div>
                        {/* Preview */}
                        <div className="flex-1 overflow-auto">
                            <div style={{ width: 1200 * previewScale, height: "100%" }}>
                                <PortfolioPreview data={data} scale={previewScale} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── Shared form components ───────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-xs font-medium text-white/40 mb-1 block">{label}</label>
            {children}
        </div>
    );
}
function Input({ value, onChange, placeholder, type = "text", disabled = false }: {
    value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
    return (
        <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder} disabled={disabled}
            className="input-glass w-full text-xs py-2 disabled:opacity-40" />
    );
}
function Textarea({ value, onChange, placeholder, rows = 3 }: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
    return (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} rows={rows} className="input-glass w-full text-xs py-2 resize-none" />
    );
}
