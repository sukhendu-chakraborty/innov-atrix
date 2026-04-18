import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Home,
    Repeat2,
    FolderOpen,
    User,
    Building2,
    BadgeCheck,
    IndianRupee,
    Calendar,
    Clock,
    Send,
    Paperclip,
    CheckCircle2,
} from "lucide-react";
import { differenceInDays, format } from "date-fns";

// ── Same dummy data as Bounty.jsx ──────────────────────────────────────────────
const DUMMY_BOUNTIES = [
    {
        id: "1",
        title: "Redesign SaaS landing page",
        description:
            "We need a fresh, modern landing page redesign for our analytics SaaS. Hero, features, pricing, and testimonials sections. Figma deliverable with desktop + mobile.",
        company_name: "Nova Studio",
        company_verified: true,
        company_bio: "Growing Indian business hiring based on verified skills and real work.",
        skills_required: ["Figma", "UI/UX", "Web Design"],
        budget: 12000,
        deadline: "2025-05-10",
        posted: "2025-04-17",
        category: "ui_ux",
    },
    {
        id: "2",
        title: "Build analytics dashboard in React",
        description:
            "Create an internal analytics dashboard using React + Recharts. Connect to provided JSON API endpoints. Deliver source code with documentation.",
        company_name: "Urjaa Labs",
        company_verified: true,
        company_bio: "Clean energy startup building data-driven solutions for the Indian market.",
        skills_required: ["React", "Recharts", "Tailwind"],
        budget: 28000,
        deadline: "2025-05-20",
        posted: "2025-04-15",
        category: "web_dev",
    },
    {
        id: "3",
        title: "Data cleaning pipeline for CRM exports",
        description:
            "Build a Python pipeline to normalize messy CSV exports. Deduplicate leads, validate emails, output clean XLSX. Bonus: add a simple Streamlit UI.",
        company_name: "AgriMantra",
        company_verified: true,
        company_bio: "AgriTech company digitizing the Indian agricultural supply chain.",
        skills_required: ["Python", "Pandas", "Data"],
        budget: 18500,
        deadline: "2025-05-05",
        posted: "2025-04-10",
        category: "data",
    },
    {
        id: "4",
        title: "Mobile app UI in Flutter",
        description:
            "Implement 12 screens from our Figma prototype in Flutter. Pixel-perfect, with smooth navigation and animations. Deliver APK + source code.",
        company_name: "Kodo Tech",
        company_verified: false,
        company_bio: "Edtech startup building next-gen learning apps for students.",
        skills_required: ["Flutter", "Dart", "Figma"],
        budget: 35000,
        deadline: "2025-06-01",
        posted: "2025-04-12",
        category: "mobile",
    },
    {
        id: "5",
        title: "SEO content articles — 10 pieces",
        description:
            "Write 10 long-form SEO articles (1500+ words) targeting keywords in the fintech and personal finance niche. Deliver in Google Docs with metadata.",
        company_name: "WealthNow",
        company_verified: true,
        company_bio: "Personal finance platform helping Indians save smarter.",
        skills_required: ["Content Writing", "SEO", "Research"],
        budget: 9000,
        deadline: "2025-04-28",
        posted: "2025-04-08",
        category: "content",
    },
    {
        id: "6",
        title: "E-commerce product feed automation",
        description:
            "Script to sync WooCommerce product catalog to Google Merchant Center and Meta Catalog automatically daily. Deliver working cron + documentation.",
        company_name: "Bazaar Digital",
        company_verified: false,
        company_bio: "D2C brand consultancy scaling Indian e-commerce businesses.",
        skills_required: ["Python", "APIs", "Automation"],
        budget: 22000,
        deadline: "2025-05-15",
        posted: "2025-04-14",
        category: "web_dev",
    },
    {
        id: "7",
        title: "Instagram growth strategy & content calendar",
        description:
            "Build a 90-day Instagram growth plan with content calendar, hashtag research, and posting schedule for a D2C brand in the wellness space.",
        company_name: "Veda Naturals",
        company_verified: true,
        company_bio: "Ayurvedic wellness brand going digital.",
        skills_required: ["Marketing", "Social Media", "Content"],
        budget: 7500,
        deadline: "2025-05-08",
        posted: "2025-04-09",
        category: "marketing",
    },
    {
        id: "8",
        title: "Node.js REST API for inventory management",
        description:
            "Build a RESTful API with Node.js/Express and MongoDB for tracking warehouse inventory, orders, and suppliers. Include Postman collection.",
        company_name: "SwiftStock",
        company_verified: true,
        company_bio: "B2B logistics startup modernizing warehouse operations.",
        skills_required: ["Node.js", "MongoDB", "REST API"],
        budget: 45000,
        deadline: "2025-06-15",
        posted: "2025-04-16",
        category: "web_dev",
    },
    {
        id: "9",
        title: "Brand identity & logo design",
        description:
            "Full brand identity package: logo (3 concepts), colour palette, typography, and brand usage guidelines PDF. Deliver all source files.",
        company_name: "Sunrise Exports",
        company_verified: false,
        company_bio: "Export-import firm entering the domestic retail market.",
        skills_required: ["Logo Design", "Branding", "Illustrator"],
        budget: 14000,
        deadline: "2025-05-25",
        posted: "2025-04-13",
        category: "ui_ux",
    },
];

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const initial = (user.name || "U")[0].toUpperCase();

    return (
        <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-neutral-900/40 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-40">
            <div className="p-8">
                <div className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-[#ba9eff] to-[#699cff] bg-clip-text text-transparent">
                    Step-A-Ahead
                </div>
                <div className="text-xs text-white/30 tracking-wider uppercase mt-1 font-semibold">
                    Future of Work
                </div>
            </div>
            <div className="flex-1 px-4 space-y-2 mt-4">
                <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all group">
                    <Home className="h-4 w-4" />
                    <span className="font-medium text-sm">Home</span>
                </Link>
                <Link to="/bounties" className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#ba9eff] border-r-2 border-[#ba9eff] font-bold bg-white/5 transition-all">
                    <Repeat2 className="h-4 w-4" />
                    <span className="font-medium text-sm">Bounties</span>
                </Link>
                <Link to="/bounties" className="flex items-center gap-4 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all group">
                    <FolderOpen className="h-4 w-4" />
                    <span className="font-medium text-sm">Projects</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all group">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">Profile</span>
                </Link>
            </div>

            {/* Nudge card */}
            <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/20">
                <p className="text-xs font-bold text-white mb-1">Level up faster</p>
                <p className="text-[11px] text-white/40 leading-relaxed">
                    Complete a bounty this week to boost your profile score.
                </p>
            </div>

            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{user.name || "Guest"}</div>
                        <div className="text-xs text-white/30 truncate">{user.email || ""}</div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BountyDetail() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("submit");
    const [workLink, setWorkLink] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const bounty = DUMMY_BOUNTIES.find((b) => b.id === id) || DUMMY_BOUNTIES[0];
    const deadline = bounty.deadline ? new Date(bounty.deadline) : null;
    const posted = bounty.posted ? new Date(bounty.posted) : null;
    const daysLeft = deadline ? differenceInDays(deadline, new Date()) : null;
    const companyInitial = bounty.company_name[0].toUpperCase();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (workLink.trim()) setSubmitted(true);
    };

    const tabs = [
        { id: "submit", label: "Submit" },
        { id: "submissions", label: "Submissions (0)" },
        { id: "discussion", label: "Discussion" },
    ];

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <Sidebar />

            <main className="md:pl-64 min-h-screen">
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Back link */}
                    <Link
                        to="/bounties"
                        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-8 group"
                    >
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to marketplace
                    </Link>

                    {/* Two-column grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* ── Left column ── */}
                        <div className="xl:col-span-2 space-y-5">

                            {/* Hero header card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 sm:p-8"
                            >
                                {/* Company row */}
                                <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
                                    <Building2 className="w-4 h-4" />
                                    <span>{bounty.company_name}</span>
                                    {bounty.company_verified && (
                                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                            <BadgeCheck className="w-4 h-4" />
                                            Verified
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">
                                    {bounty.title}
                                </h1>

                                {/* Meta row */}
                                <div className="flex flex-wrap gap-5 text-sm text-white/50">
                                    <span className="flex items-center gap-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-white" />
                                        <span className="text-white font-semibold">
                                            {Number(bounty.budget).toLocaleString("en-IN")}
                                        </span>
                                    </span>
                                    {deadline && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Due {format(deadline, "MMM d, yyyy")}
                                        </span>
                                    )}
                                    {posted && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            Posted {format(posted, "MMM d")}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Description card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.07 }}
                                className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 sm:p-8"
                            >
                                <h2 className="text-base font-semibold text-white mb-3">Description</h2>
                                <p className="text-sm text-white/50 leading-relaxed mb-6">
                                    {bounty.description}
                                </p>

                                <h2 className="text-base font-semibold text-white mb-3">Required skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {bounty.skills_required.map((s) => (
                                        <span
                                            key={s}
                                            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-medium"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Tab card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.14 }}
                                className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden"
                            >
                                {/* Tab nav */}
                                <div className="flex border-b border-white/8 px-6 pt-4 gap-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                                                activeTab === tab.id
                                                    ? "text-white bg-white/5 border border-white/10 border-b-0 -mb-px pb-[9px]"
                                                    : "text-white/40 hover:text-white/70"
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab content */}
                                <div className="p-6">
                                    {activeTab === "submit" && (
                                        <>
                                            {submitted ? (
                                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                                                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-base font-semibold text-white mb-1">Work submitted!</h3>
                                                    <p className="text-sm text-white/40">The employer will review your submission.</p>
                                                    <button
                                                        className="mt-4 text-sm text-white/40 hover:text-white transition-colors underline underline-offset-2"
                                                        onClick={() => { setSubmitted(false); setWorkLink(""); setNotes(""); }}
                                                    >
                                                        Submit another
                                                    </button>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="space-y-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-white mb-2">
                                                            Link to your work
                                                        </label>
                                                        <div className="relative">
                                                            <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                                                            <input
                                                                type="url"
                                                                value={workLink}
                                                                onChange={(e) => setWorkLink(e.target.value)}
                                                                placeholder="https://github.com/... or Figma link"
                                                                className="w-full h-11 pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-purple-500/40 transition-all"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-white mb-2">
                                                            Notes <span className="text-white/30 font-normal">(optional)</span>
                                                        </label>
                                                        <textarea
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                            placeholder="What did you build? Any assumptions?"
                                                            rows={4}
                                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        Submit work
                                                    </button>
                                                </form>
                                            )}
                                        </>
                                    )}

                                    {activeTab === "submissions" && (
                                        <div className="flex flex-col items-center justify-center py-14 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                                <Send className="w-5 h-5 text-white/20" />
                                            </div>
                                            <p className="text-sm font-semibold text-white">No submissions yet</p>
                                            <p className="text-xs text-white/35 mt-1">Be the first to submit your work.</p>
                                        </div>
                                    )}

                                    {activeTab === "discussion" && (
                                        <div className="flex flex-col items-center justify-center py-14 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                                <span className="text-white/20 text-xl">💬</span>
                                            </div>
                                            <p className="text-sm font-semibold text-white">No discussion yet</p>
                                            <p className="text-xs text-white/35 mt-1">Ask the employer a question.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── Right column ── */}
                        <div className="space-y-5">

                            {/* Employer card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.1 }}
                                className="rounded-2xl bg-white/[0.03] border border-white/8 p-6"
                            >
                                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                                    Employer
                                </p>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                        {companyInitial}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{bounty.company_name}</div>
                                        {bounty.company_verified && (
                                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium mt-0.5">
                                                <BadgeCheck className="w-3 h-3" />
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    {bounty.company_bio}
                                </p>
                            </motion.div>

                            {/* Budget / CTA card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.18 }}
                                className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-white mb-0.5">Ready to ship?</p>
                                    <p className="text-xs text-white/60 mb-4">Submit your work before the deadline to qualify.</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <IndianRupee className="w-5 h-5 text-white" />
                                        <span className="text-3xl font-black text-white">
                                            {Number(bounty.budget).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/50">Budget · paid on acceptance</p>
                                </div>
                            </motion.div>

                            {/* Deadline info */}
                            {deadline && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: 0.24 }}
                                    className="rounded-2xl bg-white/[0.03] border border-white/8 p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-white/50">
                                            <Calendar className="w-4 h-4" />
                                            Deadline
                                        </div>
                                        <span className={`text-sm font-semibold ${daysLeft !== null && daysLeft < 7 ? "text-rose-400" : "text-white"}`}>
                                            {daysLeft !== null && daysLeft >= 0
                                                ? `${daysLeft}d left`
                                                : "Expired"} · {format(deadline, "MMM d, yyyy")}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-0 w-full h-16 bg-[#0e0e0e]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-50 px-2">
                <Link to="/" className="flex flex-col items-center w-16 text-white/40 hover:text-white transition-colors">
                    <Home className="h-5 w-5 mb-1" />
                    <span className="text-[10px]">Home</span>
                </Link>
                <Link to="/bounties" className="flex flex-col items-center w-16 text-purple-400">
                    <Repeat2 className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold">Bounties</span>
                </Link>
                <Link to="/dashboard" className="flex flex-col items-center w-16 text-white/40 hover:text-white transition-colors">
                    <User className="h-5 w-5 mb-1" />
                    <span className="text-[10px]">Profile</span>
                </Link>
            </nav>
        </div>
    );
}