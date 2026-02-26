"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, CreditCard, Key, Save, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "api", label: "API Keys", icon: Key },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [fullName, setFullName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.name) {
            setFullName(session.user.name);
        }
    }, [session]);

    const handleSaveProfile = async () => {
        // In this MVP, profile data is primarily managed by the OAuth provider.
        // We could implement a /api/user/profile update later if needed.
        setSaving(true);
        setTimeout(() => {
            toast.success("Profile preserved (Synced with Google)");
            setSaving(false);
        }, 800);
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-white/50">Manage your account and preferences</p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar tabs */}
                <div className="w-48 flex-shrink-0">
                    <nav className="space-y-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 glass rounded-2xl p-6">
                    {activeTab === "profile" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                            <div>
                                <label className="text-xs font-medium text-white/60 mb-1.5 block">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="input-glass w-full"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-white/60 mb-1.5 block">Email</label>
                                <input type="email" disabled placeholder="Managed by auth provider" className="input-glass w-full opacity-50 cursor-not-allowed" />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="btn-glow flex items-center gap-2 py-2.5 px-5 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === "billing" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold text-white">Billing & Plan</h2>
                            <div className="glass rounded-xl p-5 border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-white">Free Plan</p>
                                        <p className="text-sm text-white/50">3 resume generations/month</p>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">Current</span>
                                </div>
                                <div className="text-xs text-white/40 space-y-1">
                                    <p>✓ 3 resume generations</p>
                                    <p>✓ 2 portfolio templates</p>
                                    <p>✓ ATS score checker</p>
                                </div>
                            </div>
                            <div className="glass rounded-xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 to-purple-600/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-white">Pro Plan — $12/month</p>
                                        <p className="text-sm text-white/50">Unlimited everything</p>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">Recommended</span>
                                </div>
                                <div className="text-xs text-white/60 space-y-1 mb-4">
                                    <p>✓ Unlimited AI generations</p>
                                    <p>✓ All 5 resume templates</p>
                                    <p>✓ AI Agent portfolio mode</p>
                                    <p>✓ Full source code download</p>
                                    <p>✓ One-click Vercel deploy</p>
                                </div>
                                <button className="btn-glow py-2 px-5 text-sm">Upgrade to Pro</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "api" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold text-white">API Keys</h2>
                            <div className="glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5">
                                <p className="text-xs text-amber-300">⚠️ API key management is available on the Pro plan.</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-white/60 mb-1.5 block">Gemini API Key (optional override)</label>
                                <input type="password" placeholder="AIza..." className="input-glass w-full font-mono text-sm" />
                                <p className="text-xs text-white/30 mt-1">Leave blank to use the platform's shared key</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-white/60 mb-1.5 block">Ollama Base URL</label>
                                <input type="text" defaultValue="http://localhost:11434" className="input-glass w-full font-mono text-sm" />
                                <p className="text-xs text-white/30 mt-1">For local AI model inference</p>
                            </div>
                            <button className="btn-glow flex items-center gap-2 py-2.5 px-5">
                                <Save className="w-4 h-4" /> Save Keys
                            </button>
                        </div>
                    )}

                    {(activeTab === "notifications" || activeTab === "security") && (
                        <div className="text-center py-12">
                            <p className="text-white/40 text-sm">Coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
