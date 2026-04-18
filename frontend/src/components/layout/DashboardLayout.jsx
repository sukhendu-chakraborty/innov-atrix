import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    if (!user) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    const navItems = [
        { name: "Home", icon: "home", path: "/" },
        { name: "Bounties", icon: "rebase_edit", path: "/bounties" },
        { name: "Projects", icon: "folder_open", path: "/projects" },
        { name: "Profile", icon: "person", path: "/dashboard", filled: true }
    ];

    return (
        <div className="bg-background text-on-surface font-body antialiased min-h-screen selection:bg-primary-container selection:text-on-primary-container dark">
            <style>{`
                body { font-family: 'Inter', sans-serif; }
                .nebula-shadow { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px rgba(186, 158, 255, 0.05); }
                .glass-panel { backdrop-filter: blur(20px); background-color: rgba(38, 38, 38, 0.4); }
                .ghost-border { border: 1px solid rgba(73, 72, 71, 0.15); }
                .card-gradient { background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%); }
            `}</style>

            {/* Top Navigation (Mobile) */}
            <nav className="md:hidden w-full h-16 fixed top-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-lg flex items-center justify-between px-6 shadow-xl border-b border-outline-variant/10">
                <div className="text-2xl font-black bg-gradient-to-br from-[#ba9eff] to-[#699cff] bg-clip-text text-transparent tracking-tighter">Step-A-Head</div>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
                </button>
            </nav>

            {/* Side Navigation (Web) */}
            <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-neutral-900/40 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_rgba(186,158,255,0.05)] z-40 transition-all">
                <div className="p-8">
                    <div className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-[#ba9eff] to-[#699cff] bg-clip-text text-transparent">Step-A-Head</div>
                    <div className="text-xs text-on-surface-variant tracking-wider uppercase mt-1 font-semibold opacity-70">Future of Work</div>
                </div>
                <div className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? "text-[#ba9eff] border-r-2 border-[#ba9eff] font-bold bg-white/5" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
                            >
                                <span className={`material-symbols-outlined group-hover:scale-110 transition-transform duration-200`} style={{ fontVariationSettings: isActive || item.filled ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                                <span className="font-medium tracking-wide text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <img alt="User Avatar" className="w-10 h-10 rounded-full border border-primary/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1lOPj05CQDq-gZkOlVLaN4Rt-x5Y9907-RMvFHtfrFlJbE6Pwji_VLT13vUx0Y_kdsCpjgF2fAQrKnvHYvZyTYsXAFLSGf4zA6WSO6hMsC6F-b2TTAn2_jsztGF7bgev45dbOZQ0Z6HIN6rWIyEx_uBCyjTNFuubo-hqWgj7YOwd6e7x_3RzyiptdJ09J8X2t4cmjTwkLkwHEMmnHtRSMahHpwuYFJnaDOdLfgvnTfRr-X6wKPw75hTBl7m6_AmJlxiXjqhmbwQ8" />
                        <div>
                            <div className="text-sm font-semibold text-on-surface truncate max-w-[120px]">{user.name || "User"}</div>
                            <div className="text-xs text-on-surface-variant truncate max-w-[120px]">{user.email || "user@example.com"}</div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="pt-20 pb-24 md:pt-10 md:pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Outlet context={{ user }} />
                </div>
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 w-full h-16 bg-[#0e0e0e]/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center z-50 px-2 pb-safe">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
                        >
                            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: isActive || item.filled ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
