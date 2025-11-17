// File: src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom"; // <-- This line is now fixed
import ChatPage from "./pages/ChatPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Layout from "./components/Layout";
// 1. Import Clerk components
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function App() {
  return (
    <Routes>
      {/* 2. Create a protected route group */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Layout />
            </SignedIn>
            <SignedOut>
              {/* 3. Redirect to sign-in if not authenticated */}
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      >
        {/* These routes are now protected */}
        <Route index element={<ChatPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* 4. Create public sign-in and sign-up routes */}
      <Route
        path="/sign-in"
        element={
          <div className="flex justify-center items-center min-h-screen">
            <SignIn routing="path" path="/sign-in" />
          </div>
        }
      />
      <Route
        path="/sign-up"
        element={
          <div className="flex justify-center items-center min-h-screen">
            <SignUp routing="path" path="/sign-up" />
          </div>
        }
      />

      {/* 5. Update the catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}