"use client"

import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
    >
      <nav className="flex items-center justify-between px-5 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">

        <div className="text-white font-semibold">Step-A-Head</div>

        <div className="hidden md:flex gap-6 text-zinc-300">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </div>

        <button className="bg-white text-black px-4 py-1.5 rounded-full">
          Get Started
        </button>
      </nav>
    </motion.header>
  )
}