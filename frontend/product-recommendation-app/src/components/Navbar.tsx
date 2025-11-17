import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import logoSrc from "../assets/Logo_Spacio.svg"; 

export default function Navbar() {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <nav className="relative z-20 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center">
            
            <div className="flex-shrink-0 relative mr-4"> 
              <NavLink to="/" className="block"> 
                <img 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 h-24 w-auto" 
                  src={logoSrc} 
                  alt="Spacio Logo" 
                />
              </NavLink>
              <div className="h-16 w-20"></div> 
            </div>

            <div className="ml-16 flex items-baseline space-x-4">
              <NavLink to="/" className={getNavLinkClass}>
                Search
              </NavLink>
              <NavLink to="/analytics" className={getNavLinkClass}>
                Analytics
              </NavLink> 
            </div>
          </div>
          
          <div className="ml-auto">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>

        </div>
      </div>
    </nav>
  );
}