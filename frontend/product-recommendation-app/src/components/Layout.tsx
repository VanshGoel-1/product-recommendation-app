import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* The Outlet renders the current route's component (e.g., ChatPage) */}
        <Outlet />
      </main>
    </div>
  );
}