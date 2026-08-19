"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/CenifyITLogo.png";

export default function CRMMarketingHeader() {
  const links = [
    {
      name: "Features",
      href: "#features",
    },
    {
      name: "How It Works",
      href: "#how-it-works",
    },
    {
      name: "Pricing",
      href: "#pricing",
    },
    {
      name: "FAQ",
      href: "#faq",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            width={160}
            height={80}
            alt="CenifyIT Logo"
            className="w-[160px] h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
