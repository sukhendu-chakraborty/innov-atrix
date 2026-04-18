"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import BorderGlow from "../BorderGlow"

export default function SignupFormDemo({ onNext }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const { name, email, phone, password } = formData
        if (!name || !email || !phone || !password) {
            setError("All fields are required.")
            return
        }
        setError("")
        onNext(formData)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex items-center justify-center p-4"
        >
            {/* 🌟 BORDER GLOW WRAPPER (ENTIRE CARD INCLUDING BUTTON AREA) */}
            <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0a0a0a"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
            >
                {/* 🧊 FORM CARD */}
                <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-white/10 p-6 md:p-8">

                    {/* HEADER */}
                    <h2 className="text-xl font-bold text-white">
                        Welcome to Step-A-Head
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        Create your account to continue
                    </p>

                    {/* FORM */}
                    <form className="my-8" onSubmit={handleSubmit}>

                        {/* FULL NAME */}
                        <LabelInputContainer className="mb-4">
                            <Label className="text-zinc-300" htmlFor="name">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500"
                            />
                        </LabelInputContainer>

                        {/* EMAIL */}
                        <LabelInputContainer className="mb-4">
                            <Label className="text-zinc-300" htmlFor="email">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500"
                            />
                        </LabelInputContainer>

                        {/* PHONE */}
                        <LabelInputContainer className="mb-4">
                            <Label className="text-zinc-300" htmlFor="phone">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500"
                            />
                        </LabelInputContainer>

                        {/* PASSWORD */}
                        <LabelInputContainer className="mb-6">
                            <Label className="text-zinc-300" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500"
                            />
                        </LabelInputContainer>

                        {/* ERROR */}
                        {error && (
                            <p className="text-red-400 text-sm mb-4">{error}</p>
                        )}

                        {/* 🔥 SIGNUP BUTTON (INSIDE GLOW EFFECT VISUAL ZONE) */}
                        <div className="relative group w-full">
                            <button
                                type="submit"
                                className="relative w-full h-10 rounded-md bg-gradient-to-br from-zinc-900 to-black text-white font-medium overflow-hidden"
                            >
                                Continue →
                            </button>

                            {/* 🔥 REQUIRED BOTTOM GLOW */}
                            <BottomGradient />
                        </div>
                    </form>
                </div>
            </BorderGlow>
        </motion.div>
    )
}

/* =========================
   🔥 BOTTOM GRADIENT (WORKING)
========================= */
const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

            <span className="absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm group-hover:opacity-100 transition duration-500" />
        </>
    )
}

/* =========================
   INPUT WRAPPER
========================= */
const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    )
}
// Trigger HMR
