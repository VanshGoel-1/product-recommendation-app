import { useEffect, useState } from "react";

export default function CinematicBackground({ dimmed = false }: { dimmed?: boolean }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="fixed inset-0 -z-10 h-full w-full bg-[#0B1026]" />;

    return (
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#0B1026] overflow-hidden pointer-events-none">
            <div className={`absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-blue-900/20 blur-[120px] transition-all duration-1000 ${dimmed ? "opacity-10 scale-90" : "opacity-30 hover:scale-105"}`} />
            <div className={`absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[120px] transition-all duration-1000 ${dimmed ? "opacity-10 scale-90" : "opacity-30 hover:scale-105"}`} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay" />
        </div>
    );
}
