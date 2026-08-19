"use client";
import Header from "../components/CRMHeader";
import Footer from "../components/Footer";
import { useAuth } from "../context/auth/context";
import { useState } from "react";
export default function PublicLayout({ children }) {
  const { user, client } = useAuth();
  console.log("User in PublicLayout:", user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <Header client={client} />
      <main>{children}</main> {/* server-rendered children */}
    </>
  );
}
