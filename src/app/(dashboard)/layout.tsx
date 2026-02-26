"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarWidth = collapsed ? 72 : 240;

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <Topbar
                sidebarCollapsed={collapsed}
                onMobileMenuOpen={() => setMobileOpen(true)}
            />
            {/* Content area — full width on mobile, offset by sidebar on desktop */}
            <main className="pt-20 min-h-screen">
                <div
                    className="p-4 md:p-8 transition-all duration-300"
                    style={{
                        // Only apply margin on md+ screens; on mobile sidebar is an overlay
                        // We use a CSS media query via a data attribute trick
                    }}
                >
                    {/* Desktop spacer that matches sidebar width */}
                    <style>{`
                        @media (min-width: 768px) {
                            .main-content {
                                margin-left: ${sidebarWidth}px;
                            }
                        }
                    `}</style>
                    <div className="main-content transition-all duration-300">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
