import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function AIPreviewCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-2xl backdrop-blur-xl"
        >
            {/* Product Image Placeholder */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#0B1026]/50 p-2 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
                <img
                    src="/src/assets/lamp.webp"
                    alt="Minimalist Study Lamp"
                    className="relative z-10 w-full h-full object-cover rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105"
                />

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-sm font-bold text-white border border-white/10 z-20">
                    ₹2,499
                </div>
            </div>

            {/* AI Reasoning Block */}
            <div className="mt-4 space-y-3 p-2">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-500/20 p-1.5 text-blue-400">
                        <Sparkles size={14} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">AI Reasoning</span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white leading-tight">Lumina Lamp</h3>
                    <p className="text-sm text-gray-400">
                        "Perfect match for <span className="text-white font-medium underline decoration-blue-500/50 decoration-2 underline-offset-2">late-night study</span> with <span className="text-white font-medium underline decoration-purple-500/50 decoration-2 underline-offset-2">eye-care mode</span>."
                    </p>
                </div>

                {/* Feature Matches */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {["Adjustable Brightness", "Minimalist Design", "Eye Care Mode"].map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-gray-300 border border-white/5">
                            <CheckCircle2 size={10} className="text-emerald-400" />
                            {feat}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
