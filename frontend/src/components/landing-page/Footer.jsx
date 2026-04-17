import React from "react";
import { motion } from "framer-motion";
import Tooltip from "../Toolpit"; // ✅ adjust path if needed

const Footer = () => {
    // Variants for name animation
    const nameVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 1.2,
                ease: "easeOut",
                delay: 0.2,
            },
        },
    };

    return (
        <footer className="w-full py-16 bg-black border-t border-gray-800 select-none">

            {/* FULL-WIDTH NAME (SINGLE LINE) YES*/}
            <div className="w-full flex justify-center mb-12">
                <motion.h1
                    className="font-bold tracking-tight text-center whitespace-nowrap leading-none"
                    style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "10vw",
                        background:
                            "linear-gradient(180deg, #ffffff 10%, #cfcfcf 60%, #6f6f6f 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                    variants={nameVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                        scale: 1.05,
                        letterSpacing: "4px",
                        transition: { duration: 0.3 },
                    }}
                >
                    ALWAYS ONE STEP AHEAD
                </motion.h1>
            </div>

            {/* SOCIAL ICONS & OTHER INFO */}
            <div className="max-w-7xl mx-auto px-5 w-full flex flex-col md:flex-row justify-between items-center gap-10">

                {/* Terms */}
                <p className="text-gray-400 hover:text-gray-200 duration-200 cursor-pointer text-center md:text-left">
                    Terms & Conditions
                </p>

                {/* ✅ Tooltip Social Icons (REPLACED HERE) */}
                <div className="flex justify-center items-center">
                    <Tooltip />
                </div>

                {/* Copyright */}
                <p className="text-gray-400 text-center md:text-right">
                    © {new Date().getFullYear()} AlgoRhythm. All rights reserved.
                </p>
            </div>

        </footer>
    );
};

export default Footer;
