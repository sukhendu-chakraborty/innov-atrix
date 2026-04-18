"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"

export default function Navbar({ onGetStarted, onOpenLogin }) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
    >
      <nav className="flex items-center justify-between px-5 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">

        {/* LEFT */}
        <div className="text-white font-semibold cursor-default">
          Step-A-Head
        </div>

        {/* CENTER LINKS */}
        <div className="hidden md:flex gap-6 text-zinc-300">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* USER ICON → LOGIN */}
          <button
            onClick={onOpenLogin}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <User size={18} />
          </button>

          {/* GET STARTED → SIGNUP */}
          <button
            onClick={onGetStarted}
            className="bg-white text-black px-4 py-1.5 rounded-full hover:bg-zinc-200 transition-colors font-medium"
          >
            Get Started
          </button>

        </div>

      </nav>
    </motion.header>
  )
}