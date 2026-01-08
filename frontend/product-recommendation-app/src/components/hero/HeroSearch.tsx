import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";


export default function HeroSearch() {
    return (
        <div className="relative w-full max-w-xl group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur transition duration-500 group-hover:opacity-60 group-focus-within:opacity-100 group-focus-within:duration-200" />
            <div className="relative flex items-center bg-[#0f1629] rounded-xl ring-1 ring-white/10 transition-all focus-within:ring-white/20">
                <Search className="ml-4 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <Link to="/search" className="flex-1">
                    <input
                        type="text"
                        readOnly
                        placeholder="Elegant and modern bedroom lamp perfect for any room"
                        className="w-full bg-transparent px-4 py-4 text-white placeholder:text-gray-500 focus:outline-none cursor-pointer"
                    />
                </Link>
                <div className="pr-2">
                    <Link
                        to="/search"
                        className="flex items-center gap-2 rounded-lg bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all"
                    >
                        Find matches <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
