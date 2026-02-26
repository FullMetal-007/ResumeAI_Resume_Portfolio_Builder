export type PortfolioStyle = "developer-dark" | "agency-pro" | "minimal-light";

export interface PortfolioPersonalInfo {
    name: string;
    title: string;
    bio: string;
    email: string;
    location?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    avatar?: string;
}

export interface PortfolioProject {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    featured: boolean;
}

export interface PortfolioSkillGroup {
    id: string;
    category: string;
    items: string[];
}

export interface PortfolioExperience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface PortfolioData {
    personalInfo: PortfolioPersonalInfo;
    projects: PortfolioProject[];
    skills: PortfolioSkillGroup[];
    experience: PortfolioExperience[];
    style: PortfolioStyle;
    sections: {
        showAbout: boolean;
        showProjects: boolean;
        showSkills: boolean;
        showExperience: boolean;
        showContact: boolean;
    };
}

// AI Agent wizard step data
export interface WizardStep1 {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
}

export interface WizardStep2 {
    github: string;
    linkedin: string;
    website: string;
}

export interface WizardStep3 {
    skills: string; // comma-separated
    experience: string; // years
    specialization: string;
}

export interface WizardStep4 {
    projects: Array<{
        name: string;
        description: string;
        tech: string;
        url: string;
    }>;
}

export interface WizardStep5 {
    style: PortfolioStyle;
    colorScheme: string;
    tone: "professional" | "creative" | "minimal";
}

export interface WizardData {
    step1: WizardStep1;
    step2: WizardStep2;
    step3: WizardStep3;
    step4: WizardStep4;
    step5: WizardStep5;
}

export const defaultWizardData: WizardData = {
    step1: { name: "", title: "", bio: "", location: "", email: "" },
    step2: { github: "", linkedin: "", website: "" },
    step3: { skills: "", experience: "2", specialization: "" },
    step4: { projects: [{ name: "", description: "", tech: "", url: "" }] },
    step5: { style: "developer-dark", colorScheme: "#6366f1", tone: "professional" },
};

// Generated portfolio file
export interface GeneratedFile {
    path: string;
    content: string;
    language: string;
}

export interface GeneratedPortfolio {
    files: GeneratedFile[];
    previewHtml: string;
    deployConfig: {
        framework: string;
        buildCommand: string;
        outputDir: string;
    };
}

export const PORTFOLIO_TEMPLATE_META = [
    {
        id: "developer-dark" as PortfolioStyle,
        name: "Developer Dark",
        description: "Terminal-inspired dark theme with code aesthetics. Perfect for developers.",
        tag: "Most Popular",
        preview: "bg-gradient-to-br from-gray-800 to-gray-950",
        accent: "#10b981",
        isPremium: false,
    },
    {
        id: "agency-pro" as PortfolioStyle,
        name: "Agency Pro",
        description: "Bold, modern agency-style with large typography and project showcases.",
        tag: "Premium",
        preview: "bg-gradient-to-br from-blue-600 to-indigo-800",
        accent: "#6366f1",
        isPremium: true,
    },
    {
        id: "minimal-light" as PortfolioStyle,
        name: "Minimal Light",
        description: "Clean, elegant light-mode portfolio with refined typography.",
        tag: "Clean",
        preview: "bg-gradient-to-br from-slate-100 to-slate-300",
        accent: "#0f172a",
        isPremium: false,
    },
] as const;
