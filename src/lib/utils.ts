import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined): string {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(d);
}

export function truncate(str: string, length: number): string {
    return str.length > length ? str.slice(0, length) + "..." : str;
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
