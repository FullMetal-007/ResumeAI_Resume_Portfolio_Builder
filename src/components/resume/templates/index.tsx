export { ModernProfessionalTemplate } from "./modern-professional";
export { MinimalATSTemplate } from "./minimal-ats";
export { CreativeGradientTemplate } from "./creative-gradient";
export { TechFocusedTemplate } from "./tech-focused";
export { ExecutiveTemplate } from "./executive";

import { ResumeData, ResumeConfig } from "@/types/resume";
import { ModernProfessionalTemplate } from "./modern-professional";
import { MinimalATSTemplate } from "./minimal-ats";
import { CreativeGradientTemplate } from "./creative-gradient";
import { TechFocusedTemplate } from "./tech-focused";
import { ExecutiveTemplate } from "./executive";

export const TEMPLATE_MAP = {
    "modern-professional": ModernProfessionalTemplate,
    "minimal-ats": MinimalATSTemplate,
    "creative-gradient": CreativeGradientTemplate,
    "tech-focused": TechFocusedTemplate,
    "executive": ExecutiveTemplate,
} as const;

export type TemplateId = keyof typeof TEMPLATE_MAP;

export const TEMPLATE_META = [
    {
        id: "modern-professional" as TemplateId,
        name: "Modern Professional",
        description: "Two-column layout with colored header. Best for corporate roles.",
        tag: "Most Popular",
        preview: "bg-gradient-to-br from-indigo-500 to-blue-600",
        defaultAccent: "#6366f1",
    },
    {
        id: "minimal-ats" as TemplateId,
        name: "Minimal ATS",
        description: "Single column, plain text. Maximum ATS compatibility.",
        tag: "ATS Friendly",
        preview: "bg-gradient-to-br from-blue-600 to-blue-800",
        defaultAccent: "#1e40af",
    },
    {
        id: "creative-gradient" as TemplateId,
        name: "Creative Gradient",
        description: "Bold purple gradient header with pill-style skill badges.",
        tag: "Creative",
        preview: "bg-gradient-to-br from-purple-500 to-pink-600",
        defaultAccent: "#8b5cf6",
    },
    {
        id: "tech-focused" as TemplateId,
        name: "Tech Focused",
        description: "Dark terminal aesthetic with monospace font. Perfect for developers.",
        tag: "Developer",
        preview: "bg-gradient-to-br from-emerald-600 to-teal-800",
        defaultAccent: "#10b981",
    },
    {
        id: "executive" as TemplateId,
        name: "Executive",
        description: "Formal serif layout with centered header. Ideal for senior roles.",
        tag: "Premium",
        preview: "bg-gradient-to-br from-slate-600 to-slate-900",
        defaultAccent: "#1e3a5f",
    },
] as const;

interface ResumeTemplateProps {
    templateId: TemplateId;
    data: ResumeData;
    config: ResumeConfig;
    scale?: number;
}

export function ResumeTemplate({ templateId, data, config, scale }: ResumeTemplateProps) {
    const Template = TEMPLATE_MAP[templateId];
    if (!Template) return null;
    return <Template data={data} config={config} scale={scale} />;
}
