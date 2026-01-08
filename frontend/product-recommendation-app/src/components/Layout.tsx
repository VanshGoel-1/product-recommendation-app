import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0B1026]">
      <Navbar />
      <main>
        {/* The Outlet renders the current route's component (e.g., ChatPage) */}
        <Outlet />
      </main>
    </div>
  );
}