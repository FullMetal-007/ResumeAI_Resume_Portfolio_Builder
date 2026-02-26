export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
}

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
    location?: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    honors?: string[];
}

export interface Skill {
    id: string;
    category: string;
    items: string[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export interface ResumeSections {
    showSummary: boolean;
    showExperience: boolean;
    showEducation: boolean;
    showSkills: boolean;
    showProjects: boolean;
    showCertifications: boolean;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    experience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    sections: ResumeSections;
}

export type ResumeTemplate =
    | "modern-professional"
    | "minimal-ats"
    | "creative-gradient"
    | "tech-focused"
    | "executive";

export interface ResumeConfig {
    template: ResumeTemplate;
    accentColor: string;
    fontFamily: string;
    fontSize: "sm" | "md" | "lg";
    spacing?: "compact" | "normal" | "relaxed";
    sections?: ResumeSections;
}

export interface ATSScore {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
    confidence: number;
}

export interface AIImprovementSuggestion {
    type: "bullet" | "summary" | "skill" | "keyword" | "structure";
    original: string;
    improved: string;
    reason: string;
    confidence: number;
}

export interface ResumeRecord {
    id: string;
    userId: string;
    title: string;
    data: ResumeData;
    config: ResumeConfig;
    atsScore?: number;
    templateType: ResumeTemplate;
    createdAt: string;
    updatedAt: string;
}

export const defaultResumeData: ResumeData = {
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    sections: {
        showSummary: true,
        showExperience: true,
        showEducation: true,
        showSkills: true,
        showProjects: true,
        showCertifications: false,
    },
};

export const defaultResumeConfig: ResumeConfig = {
    template: "modern-professional",
    accentColor: "#6366f1",
    fontFamily: "Inter",
    fontSize: "md",
    spacing: "normal",
};
