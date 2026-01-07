import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import logoSrc from "../assets/Spacio_.svg";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B1026]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2 group">
              <img
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
                src={logoSrc}
                alt="Spacio Logo"
              />
              <span className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                Spacio
              </span>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Search
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Analytics
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
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