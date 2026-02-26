"use client";

import { useEffect, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { PORTFOLIO_TEMPLATE_META } from "@/types/portfolio";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PortfolioViewPage() {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = sessionStorage.getItem("previewPortfolioData");
        if (stored) {
            setData(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0d1117] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white gap-4">
                <p className="text-white/40">No preview data found.</p>
                <Link href="/portfolio/editor" className="btn-glow px-6 py-2 text-sm">
                    Return to Editor
                </Link>
            </div>
        );
    }

    const template = PORTFOLIO_TEMPLATE_META.find((t) => t.id === data.style) ?? PORTFOLIO_TEMPLATE_META[0];
    const accent = template.accent;
    const isDark = data.style !== "minimal-light";

    // Same logic as PortfolioPreview in editor but full-screen
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: isDark ? (data.style === "developer-dark" ? "#0d1117" : "#0f0f1a") : "#ffffff",
                color: isDark ? "#e6edf3" : "#0f172a",
                fontFamily: "system-ui, sans-serif"
            }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div
                    style={{
                        padding: "100px 40px 80px",
                        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        background: data.style === "developer-dark"
                            ? "linear-gradient(135deg, #0d1117 0%, #161b22 100%)"
                            : data.style === "agency-pro"
                                ? `linear-gradient(135deg, ${accent}22 0%, transparent 60%)`
                                : "transparent",
                    }}
                >
                    {data.style === "developer-dark" && (
                        <div style={{ fontFamily: "monospace", color: accent, fontSize: 14, marginBottom: 16, opacity: 0.7 }}>
                            {">"} whoami
                        </div>
                    )}
                    <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
                        {data.personalInfo.name || "Your Name"}
                    </h1>
                    <p style={{ fontSize: "clamp(1.2rem, 4vw, 1.5rem)", color: accent, fontWeight: 600, marginTop: 12, marginBottom: 20 }}>
                        {data.personalInfo.title || "Your Title"}
                    </p>
                    <p style={{ fontSize: "1.1rem", opacity: 0.6, maxWidth: 800, lineHeight: 1.8, margin: 0 }}>
                        {data.personalInfo.bio}
                    </p>
                    <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
                        {data.personalInfo.github && (
                            <span style={{ fontSize: 14, opacity: 0.5 }}>⌥ {data.personalInfo.github.replace("https://", "")}</span>
                        )}
                        {data.personalInfo.email && (
                            <span style={{ fontSize: 14, opacity: 0.5 }}>✉ {data.personalInfo.email}</span>
                        )}
                        {data.personalInfo.location && (
                            <span style={{ fontSize: 14, opacity: 0.5 }}>⌖ {data.personalInfo.location}</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Main content */}
                    <div className="flex-1 p-10 md:p-16">
                        {/* Projects */}
                        {data.sections.showProjects && data.projects.length > 0 && (
                            <div style={{ marginBottom: 64 }}>
                                <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginBottom: 32 }}>
                                    Featured Projects
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {data.projects.map((p) => (
                                        <div key={p.id} style={{
                                            padding: 28,
                                            borderRadius: 16,
                                            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                        }}>
                                            <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>{p.name}</p>
                                            <p style={{ fontSize: 14, opacity: 0.5, marginTop: 8, lineHeight: 1.6 }}>{p.description}</p>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                                                {p.technologies.map((t) => (
                                                    <span key={t} style={{
                                                        fontSize: 12, padding: "4px 12px", borderRadius: 6,
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
                                <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginBottom: 32 }}>
                                    Experience
                                </h2>
                                {data.experience.map((e) => (
                                    <div key={e.id} style={{ marginBottom: 40, paddingLeft: 24, borderLeft: `2px solid ${accent}44` }}>
                                        <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>{e.role}</p>
                                        <p style={{ fontSize: 15, color: accent, marginTop: 4, fontWeight: 500 }}>{e.company}</p>
                                        <p style={{ fontSize: 13, opacity: 0.4, marginTop: 4 }}>
                                            {e.startDate} — {e.current ? "Present" : e.endDate}
                                        </p>
                                        <p style={{ fontSize: 15, opacity: 0.6, marginTop: 12, lineHeight: 1.7 }}>{e.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div style={{
                        width: 320, flexShrink: 0, padding: "64px 40px",
                        borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    }}>
                        {/* Skills */}
                        {data.sections.showSkills && data.skills.length > 0 && (
                            <div style={{ marginBottom: 48 }}>
                                <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginBottom: 24 }}>
                                    Skills
                                </h2>
                                {data.skills.map((g) => (
                                    <div key={g.id} style={{ marginBottom: 24 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.5, marginBottom: 12 }}>{g.category}</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                            {g.items.map((s) => (
                                                <span key={s} style={{
                                                    fontSize: 12, padding: "6px 12px", borderRadius: 8,
                                                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                                                    opacity: 0.8,
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

            {/* Sticky preview controls */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 py-2 px-6 glass rounded-full border border-white/10 shadow-2xl z-50">
                <p className="text-white/60 text-xs font-medium">Full Preview Mode</p>
                <div className="w-px h-4 bg-white/10" />
                <button
                    onClick={() => window.close()}
                    className="text-white/40 hover:text-white transition-colors text-xs"
                >
                    Close Preview
                </button>
            </div>
        </div>
    );
}
