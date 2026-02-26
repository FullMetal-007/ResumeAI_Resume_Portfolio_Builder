import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Glowing 404 */}
                <div className="relative mb-8">
                    <p className="text-[120px] font-black text-white/5 leading-none select-none">404</p>
                    <p className="absolute inset-0 flex items-center justify-center text-[120px] font-black leading-none bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent blur-[2px]">
                        404
                    </p>
                    <p className="absolute inset-0 flex items-center justify-center text-[120px] font-black leading-none bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        404
                    </p>
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
                <p className="text-white/50 text-sm mb-8 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/dashboard"
                        className="btn-glow py-2.5 px-6 text-sm"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/resume"
                        className="px-6 py-2.5 glass rounded-xl text-sm text-white/60 hover:text-white transition-all border border-white/10"
                    >
                        Build Resume
                    </Link>
                </div>
            </div>
        </div>
    );
}
