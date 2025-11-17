// File: src/components/Layout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        {/* The Outlet renders the current route's component (e.g., ChatPage) */}
        <Outlet />
      </main>
    </div>
  );
}