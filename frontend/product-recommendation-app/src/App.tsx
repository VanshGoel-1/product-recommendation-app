// File: src/App.tsx

import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Layout from "./components/Layout";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
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
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="search" element={<ChatPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>


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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider >
  );
}