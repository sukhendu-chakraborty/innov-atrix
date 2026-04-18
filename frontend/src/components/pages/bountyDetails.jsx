import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Building2,
    BadgeCheck,
    IndianRupee,
    Calendar,
    Clock,
    Send,
    Paperclip,
    CheckCircle2
} from "lucide-react";
import { differenceInDays, format } from "date-fns";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BountyDetail() {
    const { id } = useParams();
    const [bounty, setBounty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    // Check if user is an MSME (based on token)
    const isMSME = !!localStorage.getItem("msme_accessToken");
    const [activeTab, setActiveTab] = useState(isMSME ? "smart-matches" : "submit");
    const [workLink, setWorkLink] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submissionCount, setSubmissionCount] = useState(0);
    const [mySubmission, setMySubmission] = useState(null);

    // AI Smart Match State
    const [aiMatches, setAiMatches] = useState([]);
    const [loadingAi, setLoadingAi] = useState(false);
    const [aiError, setAiError] = useState("");

    // Fetch submission count + student's own submission
    const fetchSubmissions = async (bountyId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`http://localhost:5000/api/submissions/bounty/${bountyId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setSubmissionCount(data.totalCount ?? 0);
                setMySubmission(data.mySubmission ?? null);
                // If student already submitted, reflect that
                if (data.mySubmission) setSubmitted(true);
            }
        } catch (_) {}
    };

    useEffect(() => {
        if (!id) { setFetchError("No bounty ID provided."); setLoading(false); return; }
        fetch(`http://localhost:5000/api/bounties/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error("Bounty not found");
                return r.json();
            })
            .then((data) => {
                const b = data.bounty;
                setBounty({
                    id: b._id,
                    title: b.title,
                    description: b.description,
                    company_name: b.msmeBusinessName || "MSME",
                    company_verified: b.msmeVerified || false,
                    company_bio: "",
                    skills_required: b.skill ? [b.skill] : [],
                    budget: b.budget,
                    deadline: b.deadline ? b.deadline.slice(0, 10) : null,
                    posted: b.createdAt ? b.createdAt.slice(0, 10) : null,
                    status: b.status || "open",
                });
            })
            .catch((err) => setFetchError(err.message))
            .finally(() => setLoading(false));

        fetchSubmissions(id);
    }, [id]);

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ── Error ──
    if (fetchError || !bounty) {
        return (
            <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-lg font-semibold text-white/60 mb-3">{fetchError || "Bounty not found"}</p>
                    <Link to="/bounties" className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2">
                        ← Back to marketplace
                    </Link>
                </div>
            </div>
        );
    }

    const deadline = bounty.deadline ? new Date(bounty.deadline) : null;
    const posted = bounty.posted ? new Date(bounty.posted) : null;
    const daysLeft = deadline ? differenceInDays(deadline, new Date()) : null;
    const companyInitial = (bounty.company_name || "M")[0].toUpperCase();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!workLink.trim()) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`http://localhost:5000/api/submissions/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ workLink, notes }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit");
            
            setSubmitted(true);
            // Refresh count after submission
            await fetchSubmissions(id);
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabs = isMSME ? [
        { id: "smart-matches", label: "Smart Matches ✨" },
        { id: "submissions", label: `Submissions (${submissionCount})` },
        { id: "discussion", label: "Discussion" },
    ] : [
        { id: "submit", label: "Submit" },
        { id: "submissions", label: `Submissions (${submissionCount})` },
        { id: "discussion", label: "Discussion" },
    ];

    useEffect(() => {
        if (isMSME && activeTab === "smart-matches" && aiMatches.length === 0) {
            setLoadingAi(true);
            fetch(`http://localhost:5000/api/ai/match/${id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.matches) {
                        setAiMatches(data.matches);
                    } else if (data.message) {
                        setAiError(data.message);
                    }
                })
                .catch(err => setAiError("Failed to fetch AI matches"))
                .finally(() => setLoadingAi(false));
        }
    }, [isMSME, activeTab, id]);

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <main className="min-h-screen">
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
                                    {activeTab === "smart-matches" && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xl">✨</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-purple-300">Neural Smart Match</p>
                                                    <p className="text-xs text-purple-400/80 mt-0.5">AI has analyzed this bounty and found the best student fits from our platform.</p>
                                                </div>
                                            </div>

                                            {loadingAi ? (
                                                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-sm text-white/50">Analyzing candidates...</p>
                                                </div>
                                            ) : aiError ? (
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                                                    <p className="text-sm text-red-400">{aiError}</p>
                                                </div>
                                            ) : aiMatches.length === 0 ? (
                                                <div className="text-center py-10">
                                                    <p className="text-sm text-white/50">No matches found.</p>
                                                </div>
                                            ) : (
                                                <div className="grid gap-4">
                                                    {aiMatches.map((match, idx) => (
                                                        <div key={idx} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col md:flex-row gap-5 items-start md:items-center hover:bg-white/[0.06] transition-colors relative overflow-hidden">
                                                            {idx === 0 && (
                                                                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 text-[10px] font-bold text-white uppercase tracking-wider rounded-bl-lg shadow-lg">
                                                                    Top Pick
                                                                </div>
                                                            )}
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                                {match.student_name[0]?.toUpperCase() || "S"}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-base font-semibold text-white truncate">{match.student_name}</h3>
                                                                <p className="text-xs text-white/50 mt-1 line-clamp-1">{match.student_skills}</p>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <div className="text-center">
                                                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1.5">AI Similarity</p>
                                                                    <div className="inline-flex px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                                                                        {match.ai_similarity?.toFixed(1) || "0.0"}%
                                                                    </div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1.5">Trust Score</p>
                                                                    <div className="inline-flex px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-sm font-bold text-purple-300">
                                                                        {match.trust_score?.toFixed(1) || "0.0"}
                                                                    </div>
                                                                </div>
                                                                <button className="h-9 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap">
                                                                    View Profile
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "submit" && !isMSME && (
                                        <>
                                            {bounty.status === "closed" ? (
                                                /* ── Bounty Closed ── */
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                                                        <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M5.07 19H19a2 2 0 001.73-2.99L13.73 4a2 2 0 00-3.46 0L3.27 16A2 2 0 005.07 19z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-base font-semibold text-white mb-1">Bounty Closed</h3>
                                                    <p className="text-sm text-white/40 max-w-xs">
                                                        A submission has already been accepted for this bounty. It is no longer open for new submissions.
                                                    </p>
                                                </div>
                                            ) : submitted ? (
                                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                                                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-base font-semibold text-white mb-1">Work submitted!</h3>
                                                    <p className="text-sm text-white/40">The employer will review your submission.</p>
                                                    <button
                                                        className="mt-4 text-sm text-white/40 hover:text-white transition-colors underline underline-offset-2"
                                                        onClick={() => setActiveTab("submissions")}
                                                    >
                                                        View my submission →
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

                                                    {submitError && (
                                                        <p className="text-sm text-rose-400 font-medium">{submitError}</p>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <Send className="w-4 h-4" />
                                                        )}
                                                        {isSubmitting ? "Submitting..." : "Submit work"}
                                                    </button>
                                                </form>
                                            )}
                                        </>
                                    )}

                                    {activeTab === "submissions" && (
                                        <div>
                                            {/* Total count banner */}
                                            <div className="flex items-center gap-2 mb-5 px-1">
                                                <span className="text-sm text-white/40">
                                                    <span className="text-white font-bold text-base">{submissionCount}</span>
                                                    {" "}student{submissionCount !== 1 ? "s" : ""} have submitted work for this bounty.
                                                </span>
                                            </div>

                                            {/* Student's own submission */}
                                            {mySubmission ? (
                                                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold text-white">Your Submission</p>
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                                                            mySubmission.status === "accepted"
                                                                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                                                : mySubmission.status === "declined"
                                                                ? "text-red-400 bg-red-400/10 border-red-400/20"
                                                                : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                                                        }`}>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1.5" />
                                                            {mySubmission.status === "accepted" ? "Accepted ✓" : mySubmission.status === "declined" ? "Declined" : "Pending Review"}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">Work Link</p>
                                                        <a
                                                            href={mySubmission.workLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2 break-all"
                                                        >
                                                            <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
                                                            {mySubmission.workLink}
                                                        </a>
                                                    </div>

                                                    {mySubmission.notes && (
                                                        <div>
                                                            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">Your Notes</p>
                                                            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{mySubmission.notes}</p>
                                                        </div>
                                                    )}

                                                    {mySubmission.status === "accepted" && (
                                                        <div className="flex items-center gap-3 mt-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                            <p className="text-sm text-emerald-400 font-semibold">
                                                                🎉 Your work was accepted! Payment has been processed.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                                        <Send className="w-5 h-5 text-white/20" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-white">You haven't submitted yet</p>
                                                    <p className="text-xs text-white/35 mt-1">Go to the Submit tab to send your work.</p>
                                                    <button
                                                        onClick={() => setActiveTab("submit")}
                                                        className="mt-4 text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                                                    >Submit now →</button>
                                                </div>
                                            )}
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

        </div>
    );
}