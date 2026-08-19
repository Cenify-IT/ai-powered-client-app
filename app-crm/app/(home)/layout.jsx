"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/auth/context";
import { useState } from "react";
export default function PublicLayout({ children }) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <Header />
      <main>{children}</main> {/* server-rendered children */}
      <Footer />
    </>
  );
}
