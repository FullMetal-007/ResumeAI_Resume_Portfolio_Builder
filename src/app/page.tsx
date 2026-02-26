"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, FileText, Globe, Zap, Shield, Download,
  ArrowRight, Check, Star, ChevronRight, Code2, Rocket,
  TrendingUp, Users, Award, Clock
} from "lucide-react";

const stats = [
  { value: "50K+", label: "Resumes Created", icon: FileText },
  { value: "12K+", label: "Portfolios Deployed", icon: Globe },
  { value: "94%", label: "ATS Pass Rate", icon: TrendingUp },
  { value: "3 min", label: "Avg Generation Time", icon: Clock },
];

const features = [
  {
    icon: FileText,
    title: "ATS-Optimized Resumes",
    description: "AI rewrites your resume with quantified impact, strong action verbs, and keyword alignment to beat any ATS system.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "Deploy Portfolio Sites",
    description: "Generate a complete Next.js portfolio with animations, dark mode, and SEO — then deploy to Vercel in one click.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "AI Agent Mode",
    description: "Answer 8 questions and our AI agent builds your entire portfolio site with production-ready code.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "ATS Score Simulator",
    description: "Get a real-time ATS compatibility score with matched keywords, missing terms, and actionable fixes.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Download,
    title: "Full Source Code",
    description: "Download your complete portfolio as a ZIP file with package.json, components, and deployment guide.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Code2,
    title: "Dual AI Engine",
    description: "Powered by Gemini 2.5 Flash for generation and local Llama 3 for fast edits — smart cost optimization.",
    color: "from-rose-500 to-pink-500",
  },
];

const templates = [
  { name: "Modern Professional", type: "Resume", tag: "Most Popular", gradient: "from-indigo-900 to-blue-900" },
  { name: "Minimal ATS", type: "Resume", tag: "ATS Friendly", gradient: "from-slate-800 to-slate-900" },
  { name: "Developer Dark", type: "Portfolio", tag: "Premium", gradient: "from-gray-900 to-emerald-950" },
  { name: "Creative Gradient", type: "Resume", tag: "Creative", gradient: "from-purple-900 to-pink-900" },
  { name: "Agency Pro", type: "Portfolio", tag: "Premium", gradient: "from-blue-900 to-indigo-900" },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Software Engineer at Google",
    text: "Got 3 interviews in a week after using the AI optimizer. My ATS score went from 42% to 91%.",
    avatar: "SK",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Marcus T.",
    role: "Frontend Dev at Stripe",
    text: "The portfolio wizard generated a full Next.js site in under 3 minutes. Deployed it to Vercel right away.",
    avatar: "MT",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Priya R.",
    role: "Product Manager at Notion",
    text: "The DOCX export is perfect for recruiters who need Word format. Saved me hours of formatting.",
    avatar: "PR",
    color: "from-emerald-500 to-teal-500",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to get started",
    features: [
      "3 resume generations/month",
      "2 portfolio templates",
      "PDF export (watermarked)",
      "ATS score checker",
      "Basic AI suggestions",
    ],
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious job seekers",
    features: [
      "Unlimited generations",
      "All 5 resume templates",
      "All portfolio templates",
      "AI Agent mode",
      "Full source code download",
      "No watermark",
      "One-click Vercel deploy",
      "Priority AI processing",
      "Version history",
      "Advanced analytics",
    ],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlighted: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text-brand">ResumeAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#templates" className="hover:text-white transition-colors">Templates</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-3 md:px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="btn-glow text-sm py-2 px-4 md:px-5">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-6">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-300 mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini 2.5 Flash + Llama 3</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
          >
            Build Your Resume &{" "}
            <span className="gradient-text">Portfolio</span>
            <br />
            With AI
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-2xl text-white/60 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Generate job-ready ATS-optimized resumes and deploy stunning portfolios instantly.
            From AI-powered content to production-ready Next.js code.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-glow flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
              <Rocket className="w-5 h-5" />
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#templates"
              className="flex items-center gap-2 glass px-8 py-4 rounded-xl text-base font-semibold text-white/80 hover:text-white hover:border-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              View Templates
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Free tier available
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Deploy to Vercel
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="py-16 px-4 md:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-3xl md:text-4xl font-black gradient-text-brand">{s.value}</p>
                <p className="text-sm text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product mockup */}
      <section className="py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              See it in <span className="gradient-text">action</span>
            </h2>
            <p className="text-white/50 text-lg">A complete AI-powered workspace for your career</p>
          </motion.div>

          {/* Browser mockup */}
          <motion.div
            className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 mx-4">
                <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 max-w-xs mx-auto text-center">
                  resumeai.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-6 md:p-8 bg-[#0d0d15]">
              <div className="flex gap-4">
                {/* Mini sidebar */}
                <div className="hidden md:flex flex-col gap-2 w-40 flex-shrink-0">
                  {["Dashboard", "Resume Builder", "Portfolio", "Templates"].map((item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${i === 0 ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20" : "text-white/40"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main content preview */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 w-40 bg-white/10 rounded-lg mb-1" />
                      <div className="h-3 w-56 bg-white/5 rounded" />
                    </div>
                    <div className="h-9 w-28 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-80" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Resumes", "Portfolios", "ATS Score", "AI Uses"].map((label, i) => (
                      <div key={label} className="glass rounded-xl p-3">
                        <div className={`w-8 h-8 rounded-lg mb-2 bg-gradient-to-br ${["from-indigo-500 to-blue-500", "from-purple-500 to-pink-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500"][i]}`} />
                        <div className="h-5 w-8 bg-white/20 rounded mb-1" />
                        <div className="h-2.5 w-16 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {["Build Resume", "Build Portfolio", "Browse Templates"].map((label, i) => (
                      <div key={label} className="glass rounded-xl p-4">
                        <div className={`w-10 h-10 rounded-xl mb-3 bg-gradient-to-br ${["from-indigo-600 to-blue-600", "from-purple-600 to-pink-600", "from-amber-600 to-orange-600"][i]}`} />
                        <div className="h-4 w-28 bg-white/20 rounded mb-2" />
                        <div className="h-3 w-full bg-white/10 rounded mb-1" />
                        <div className="h-3 w-3/4 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">land your dream job</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              From AI-optimized resumes to fully deployable portfolio sites — all in one platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants} className="card-premium group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                  <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-24 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Premium <span className="gradient-text">Templates</span>
            </h2>
            <p className="text-white/50 text-lg">Professional designs for every career stage</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {templates.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-hover rounded-2xl p-6 w-56 md:w-64 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={`h-36 bg-gradient-to-br ${t.gradient} rounded-xl mb-4 flex items-center justify-center border border-white/5`}>
                  <FileText className="w-10 h-10 text-white/30" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.type}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {t.tag}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/signup" className="btn-glow inline-flex items-center gap-2">
              View All Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-amber-300 mb-6">
              <Award className="w-4 h-4" />
              <span>Loved by job seekers worldwide</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Real results from <span className="gradient-text">real people</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={itemVariants} className="card-premium">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-white/50 text-lg">Start free, upgrade when you&apos;re ready</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${plan.highlighted
                  ? "bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/40 shadow-glow"
                  : "glass"
                  }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black gradient-text-brand">{plan.price}</span>
                    <span className="text-white/40 text-sm">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.highlighted
                    ? "btn-glow"
                    : "glass border border-white/10 hover:border-white/20 hover:bg-white/8"
                    }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 md:p-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Ready to build your{" "}
              <span className="gradient-text">dream career?</span>
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Join thousands of professionals who landed their dream jobs with AI-powered resumes and portfolios.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-glow inline-flex items-center gap-2 text-lg px-10 py-4 w-full sm:w-auto justify-center">
                <Rocket className="w-5 h-5" />
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="glass px-8 py-4 rounded-xl text-base font-semibold text-white/70 hover:text-white transition-all w-full sm:w-auto text-center">
                View Demo
              </Link>
            </div>
            <p className="text-white/30 text-sm mt-6 flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> 50,000+ professionals already building
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold gradient-text-brand">ResumeAI</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2026 ResumeAI. Built with Gemini 2.5 Flash + Next.js
          </p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
