"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search, ChevronDown, Plus, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  NotificationsDropdown,
  SettingsDropdown,
  ClientDropdown,
} from "./CRMHeaderDropdowns";

import logo from "../../public/assets/images/CenifyITLogo.png";

export default function CRMHeader({ client }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const headerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((current) => (current === dropdown ? null : dropdown));
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    setOpenDropdown(null);
  };

  const firstName = client?.firstName || "User";
  const lastName = client?.lastName || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0) || ""}`.toUpperCase();

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex h-full items-center px-8">
        {/* Logo */}
        <Link href="/dashboard" className="mr-10 flex-shrink-0">
          <Image
            src={logo}
            alt="CenifyIT"
            width={145}
            className="h-20 w-auto"
          />
        </Link>

        {/* Main Navigation */}
        <nav className="flex items-center gap-1">
          <HeaderLink href="/dashboard" label="Dashboard" />

          <HeaderLink href="/leads" label="Leads" />

          <HeaderLink href="/clients" label="Clients" />

          <HeaderLink href="/messages" label="Messages" />

          <HeaderLink href="/reports" label="Reports" />
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="mr-4 hidden lg:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-64 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 xl:flex">
              ⌘ K
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("notifications")}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition ${
              openDropdown === "notifications"
                ? "bg-gray-100"
                : "hover:bg-gray-100"
            }`}
          >
            <Bell size={20} />

            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {openDropdown === "notifications" && (
            <NotificationsDropdown onClose={() => setOpenDropdown(null)} />
          )}
        </div>

        {/* Settings */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown("settings")}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
              openDropdown === "settings" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <Settings size={20} />
          </button>

          {openDropdown === "settings" && (
            <SettingsDropdown onClose={() => setOpenDropdown(null)} />
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 h-8 w-px bg-gray-200" />

        {/* Client */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("client")}
            className={`flex items-center gap-3 rounded-xl px-2 py-2 transition ${
              openDropdown === "client" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-sm font-semibold text-gray-900">
                {firstName} {lastName.charAt(0)}
                {lastName && "."}
              </p>

              <p className="text-xs text-gray-500">Administrator</p>
            </div>

            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform ${
                openDropdown === "client" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === "client" && (
            <ClientDropdown
              client={client}
              onClose={() => setOpenDropdown(null)}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- */
/* Header Navigation Link           */
/* -------------------------------- */

function HeaderLink({ href, label }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
    >
      {label}
    </Link>
  );
}
