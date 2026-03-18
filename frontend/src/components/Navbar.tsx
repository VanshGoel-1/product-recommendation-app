import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { ShoppingBag, Home, Search, BarChart3, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

import logoSrc from "../assets/Spacio_.svg";

export default function Navbar() {
  const { itemCount } = useCart();
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/search", label: "Search", icon: Search },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/dashboard", label: "Dashboard", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B1026]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
              src={logoSrc}
              alt="Spacio Logo"
            />
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">Spacio</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1.5 border border-white/5">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                    ? "text-white bg-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={16} className={isActive ? "text-blue-400" : ""} />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full border border-blue-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="bg-white/5 rounded-full p-1 ring-1 ring-white/10 hover:ring-white/20 transition-all">
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                    userButtonPopoverCard: "bg-[#0B1026] border border-white/10 shadow-2xl text-white",
                    userButtonPopoverListItem: "text-gray-300 hover:bg-white/5 hover:text-white focus:bg-white/5"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}