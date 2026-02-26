/**
 * Resume Storage Layer — NextAuth + MongoDB backend
 *
 * When authenticated + MongoDB configured: persists to /api/resumes
 * When not authenticated or DB not configured: falls back to localStorage
 */

import type { ResumeData, ResumeConfig } from "@/types/resume";

export interface SavedResume {
    id: string;
    name: string;
    data: ResumeData;
    config: ResumeConfig;
    atsScore?: number;
    starred: boolean;
    version?: number;
    createdAt: string;
    updatedAt: string;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

const LS_KEY = "resumeai_resumes";

function lsGetAll(): SavedResume[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function lsSave(resumes: SavedResume[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify(resumes));
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function isAuthenticated(): Promise<boolean> {
    try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        return !!session?.user;
    } catch {
        return false;
    }
}

function mapApiResume(r: Record<string, unknown>): SavedResume {
    return {
        id: (r._id ?? r.id) as string,
        name: r.name as string,
        data: r.data as ResumeData,
        config: r.config as ResumeConfig,
        atsScore: r.atsScore as number | undefined,
        starred: r.starred as boolean,
        version: r.version as number | undefined,
        createdAt: r.createdAt as string,
        updatedAt: r.updatedAt as string,
    };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function saveResume(
    resume: Omit<SavedResume, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<SavedResume> {
    const authed = await isAuthenticated();

    if (authed) {
        const res = await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resume),
        });
        if (!res.ok) throw new Error("Failed to save resume");
        const { resume: saved } = await res.json();
        return mapApiResume(saved);
    }

    // localStorage fallback
    const now = new Date().toISOString();
    const id = resume.id ?? crypto.randomUUID();
    const record: SavedResume = {
        ...resume,
        id,
        createdAt: resume.id ? (lsGetAll().find((r) => r.id === id)?.createdAt ?? now) : now,
        updatedAt: now,
    };
    const all = lsGetAll();
    const idx = all.findIndex((r) => r.id === id);
    if (idx >= 0) all[idx] = record;
    else all.unshift(record);
    lsSave(all);
    return record;
}

export async function listResumes(): Promise<SavedResume[]> {
    const authed = await isAuthenticated();

    if (authed) {
        const res = await fetch("/api/resumes");
        if (!res.ok) return lsGetAll();
        const { resumes } = await res.json();
        return (resumes ?? []).map(mapApiResume);
    }

    return lsGetAll();
}

export async function getResume(id: string): Promise<SavedResume | null> {
    const authed = await isAuthenticated();

    if (authed) {
        const res = await fetch(`/api/resumes/${id}`);
        if (!res.ok) return null;
        const { resume } = await res.json();
        return mapApiResume(resume);
    }

    return lsGetAll().find((r) => r.id === id) ?? null;
}

export async function deleteResume(id: string): Promise<void> {
    const authed = await isAuthenticated();

    if (authed) {
        await fetch(`/api/resumes/${id}`, { method: "DELETE" });
        return;
    }

    lsSave(lsGetAll().filter((r) => r.id !== id));
}

export async function toggleStarResume(id: string): Promise<void> {
    const authed = await isAuthenticated();

    if (authed) {
        // Get current state then toggle
        const res = await fetch(`/api/resumes/${id}`);
        if (!res.ok) return;
        const { resume } = await res.json();
        await fetch(`/api/resumes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ starred: !resume.starred }),
        });
        return;
    }

    const all = lsGetAll();
    const idx = all.findIndex((r) => r.id === id);
    if (idx >= 0) {
        all[idx].starred = !all[idx].starred;
        lsSave(all);
    }
}

export function isCloudStorage(): boolean {
    // Will be true when user is authenticated (checked at runtime)
    return typeof window !== "undefined" && !!document.cookie.includes("next-auth.session-token");
}
