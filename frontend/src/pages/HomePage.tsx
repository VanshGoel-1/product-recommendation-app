import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CinematicBackground from "../components/CinematicBackground";
import AIPreviewCard from "../components/hero/AIPreviewCard";

export default function HomePage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-32 overflow-x-hidden bg-[#0B1026]">
            <CinematicBackground />

            <div className="z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center">

                {/* LEFT COLUMN: Headline & Search */}
                <div className="flex flex-col items-start text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-md">
                            <Sparkles size={14} />
                            <span>AI-Powered Shopping Assistant</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                            Shop beyond <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                keywords.
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-lg mb-8 font-medium leading-relaxed">
                            Describe what you want. Spacio finds what actually fits — not just what matches words.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Link
                            to="/search"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:translate-y-[-2px]"
                        >
                            Find matches <ArrowRight className="h-5 w-5" />
                        </Link>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: AI Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex justify-center lg:justify-end items-center py-10 lg:py-0"
                >
                    <div className="relative">
                        {/* Glow effect behind card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
                        <AIPreviewCard />
                    </div>
                </motion.div>

            </div>

            {/* Footer Credibility Strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 text-xs font-medium text-white/40 uppercase tracking-widest pointer-events-none"
            >
                <span>50k+ Products Indexed</span>
                <span className="hidden sm:inline">•</span>
                <span>AI-Ranked in under 1s</span>
                <span className="hidden sm:inline">•</span>
                <span>Natural Language Intent</span>
            </motion.div>
        </div>
    );
}
