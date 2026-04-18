import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Dashboard() {
    // We grab the context. If it's undefined, we default to an empty object.
    const context = useOutletContext();
    const user = context?.user || {};

    // Helper to get initials for the profile circle
    const getInitials = (name) => {
        if (!name) return "KM";
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    // If the context exists but is empty, we still want to show the layout 
    // rather than a "No Profile Data" error.
    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="relative bg-surface-container-low rounded-3xl p-8 md:p-12 mb-8 overflow-hidden nebula-shadow border border-outline-variant/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
                    {/* Profile Picture / Initials */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/30 p-1 backdrop-blur-sm relative z-10 flex items-center justify-center bg-surface-container-highest overflow-hidden">
                            {user.profilePicture ? (
                                <img
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                    src={user.profilePicture}
                                />
                            ) : (
                                <span className="text-4xl font-bold text-primary">{getInitials(user.name || "Krishnendu Mandal")}</span>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-surface-container-highest rounded-full p-2 border border-outline-variant/20 shadow-lg z-20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[10px] uppercase tracking-widest font-bold rounded-full border border-tertiary/20 backdrop-blur-md">
                                {user.rank || "Top 1% Contributor"}
                            </span>
                        </div>

                        {/* Dynamic Name - Defaults to you if backend is slow */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
                            {user.name || "Krishnendu Mandal"}
                        </h1>

                        <p className="mt-6 text-sm text-on-surface-variant max-w-lg mx-auto md:mx-0 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                            {user.description && user.description !== "n/a"
                                ? user.description
                                : "Software Developer focused on complex algorithms and building elegant MERN stack applications like LibriX."}
                        </p>
                    </div>

                    <div className="flex gap-6 mt-6 md:mt-0 glass-panel p-6 rounded-2xl border border-outline-variant/10">
                        <div className="text-center">
                            <div className="text-3xl font-black text-on-surface tracking-tighter">{user.bountiesCompleted || "14"}</div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Bounties</div>
                        </div>
                        <div className="w-px bg-outline-variant/20"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-on-surface tracking-tighter">{user.successRate || "100"}<span className="text-lg text-primary">%</span></div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Success</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* Platform Metrics */}
                    <section className="bg-surface-container rounded-2xl p-6 md:p-8 ghost-border card-gradient relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
                                Platform Metrics
                            </h2>
                            <span className="text-xs font-semibold text-secondary px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">Live Sync</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                            <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/10 flex flex-col justify-center">
                                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Commits</div>
                                <div className="text-2xl font-bold text-on-surface tracking-tight">{user.commits || "1,429"}</div>
                            </div>
                            <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/10 flex flex-col justify-center">
                                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Issues</div>
                                <div className="text-2xl font-bold text-secondary tracking-tight">{user.issuesSolved || "89"}</div>
                            </div>
                            <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/10 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Trust Score</div>
                                    <div className="text-sm font-semibold text-on-surface-variant mt-1">Elite</div>
                                </div>
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-outline-variant/30" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="text-primary" strokeDasharray={`${user.trustScore || 98}, 100`} strokeWidth="3.5" stroke="currentColor" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <span className="absolute text-[11px] font-bold text-on-surface">{user.trustScore || "98"}</span>
                                </div>
                            </div>
                            <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/10 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Rating</div>
                                    <div className="flex items-end gap-1 mt-1">
                                        <span className="text-2xl font-bold text-tertiary leading-none tracking-tight">{user.rating || "4.9"}</span>
                                        <span className="text-[10px] font-medium text-on-surface-variant pb-[1px]">/ 5</span>
                                    </div>
                                </div>
                                <div className="flex p-2 bg-tertiary/10 rounded-full">
                                    <span className="material-symbols-outlined text-tertiary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Missions */}
                    <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 ghost-border">
                        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 0" }}>rocket_launch</span>
                            Recent Missions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/10">
                                <h3 className="text-lg font-bold text-on-surface mb-2">LibriX MERN Stack</h3>
                                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">Unified library management with MongoDB aggregation and React frontend.</p>
                                <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-auto">
                                    <div className="flex gap-2">
                                        <span className="px-2 py-0.5 bg-surface-container-highest rounded text-[10px] font-bold">MERN</span>
                                        <span className="px-2 py-0.5 bg-surface-container-highest rounded text-[10px] font-bold">Active</span>
                                    </div>
                                    <span className="text-xs font-semibold text-tertiary">Completed</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* DYNAMIC SKILLS SECTION */}
                    <section className="bg-surface-container-low rounded-2xl p-6 ghost-border card-gradient">
                        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Skills</h2>
                        <div className="space-y-5">
                            {(!user.skills || user.skills === "n/a" || user.skills.trim() === "") ? (
                                <div className="text-sm text-on-surface-variant italic">Fetching skills...</div>
                            ) : (
                                user.skills.split(',').map((skill, index) => {
                                    const s = skill.trim();
                                    const widthNum = 85 + (index * 2);
                                    const colors = [
                                        { text: "text-primary", bg: "from-primary to-primary-container" },
                                        { text: "text-secondary", bg: "from-secondary to-secondary-dim" },
                                        { text: "text-primary-dim", bg: "from-primary-dim to-inverse-primary" }
                                    ];
                                    const color = colors[index % colors.length];

                                    return (
                                        <div key={index}>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm font-semibold text-on-surface">{s}</span>
                                                <span className={`text-xs font-bold ${color.text}`}>{widthNum}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                                                <div className={`h-full bg-gradient-to-r ${color.bg} rounded-full transition-all duration-1000`} style={{ width: `${widthNum}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* Ecosystem Links */}
                    <section className="bg-surface-container-low rounded-2xl p-6 ghost-border">
                        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Ecosystem Links</h2>
                        <ul className="space-y-3">
                            <li>
                                <a className="flex items-center gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-highest border border-transparent hover:border-outline-variant/20 transition-all group" href={user.portfolioLink || "#"}>
                                    <span className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-wider">Portfolio</span>
                                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate max-w-[150px]">{user.portfolioLink || "iamKrishnendu"}</span>
                                    <span className="material-symbols-outlined text-sm ml-auto text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}