import { cn } from "@/lib/utils";

// ─── Base skeleton ─────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse bg-white/5 rounded-lg", className)} />
    );
}

// ─── Dashboard skeleton ────────────────────────────────────────────────────────
export function DashboardSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-4 w-80" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-6 space-y-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-28" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="glass rounded-2xl p-6 space-y-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Resume editor skeleton ────────────────────────────────────────────────────
export function ResumeEditorSkeleton() {
    return (
        <div className="flex gap-4 h-[calc(100vh-5rem)]">
            {/* Sidebar */}
            <div className="w-72 glass rounded-2xl p-4 space-y-3 flex-shrink-0">
                <Skeleton className="h-6 w-32 mb-4" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
            </div>
            {/* Editor */}
            <div className="flex-1 glass rounded-2xl p-6 space-y-4">
                <Skeleton className="h-7 w-48" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 rounded-xl" />
                    <Skeleton className="h-10 rounded-xl" />
                </div>
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-10 rounded-xl" />
            </div>
            {/* Preview */}
            <div className="flex-1 glass rounded-2xl overflow-hidden flex-shrink-0">
                <div className="h-10 bg-white/3 border-b border-white/5 flex items-center px-4 gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                </div>
                <div className="p-6 space-y-4">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
        </div>
    );
}

// ─── Portfolio skeleton ────────────────────────────────────────────────────────
export function PortfolioSkeleton() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-6 space-y-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-10 w-36 rounded-xl" />
                    </div>
                ))}
            </div>
            <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="glass rounded-2xl overflow-hidden">
                            <Skeleton className="h-36 w-full rounded-none" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Card skeleton ─────────────────────────────────────────────────────────────
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="glass rounded-2xl p-6 space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
            ))}
        </div>
    );
}

// ─── Table row skeleton ────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 glass rounded-xl">
                    <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            ))}
        </div>
    );
}
