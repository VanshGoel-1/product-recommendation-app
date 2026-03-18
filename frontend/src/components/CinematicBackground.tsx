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
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB4bWxucz1odHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB4bWxucz1odHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0ibm9pc2UiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-10 brightness-100 contrast-150 mix-blend-overlay" />
        </div>
    );
}
