"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Turn as Hamburger } from "hamburger-react";
import RichText from "../utils/RichText";
import { useTheme } from "@/app/context/theme/context";
import { twMerge } from "tailwind-merge";

export default function Header({ data }) {
  const { themeColors } = useTheme();

  if (!data) return null;

  const { Logo, links, callToAction, LinksWithSublinks } = data;

  // Mobile menu open
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Track which dropdowns are open by their id
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-sm ${themeColors["navigationHeaderBg"]}`}
    >
      <div className="flex items-center justify-between px-10 py-4">
        {/* Logo */}
        <div>
          {console.log("Logo data:", Logo)}
          {Logo.imageUrl ? (
            <div className="w-[100%] h-[100px]">
              <Image
                src={Logo.imageUrl}
                width={100}
                height={100}
                alt="Company Logo"
              />
            </div>
          ) : (
            <div>
              <Link href="/">
                <RichText content={Logo?.logoJsonText || []} />
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 font-semibold">
          {LinksWithSublinks.map((linkObj) => {
            const { id, LinksJson } = linkObj;
            const { mainLink, sublinks } = LinksJson;

            if (sublinks?.length) {
              return (
                <div
                  key={id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdowns({ [id]: true })}
                  onMouseLeave={() => setOpenDropdowns({ [id]: false })}
                >
                  <Link
                    href={mainLink.href}
                    className={` transition ${themeColors["primaryText"]} hover:${themeColors["accentText"]} `}
                  >
                    {mainLink.label}
                  </Link>

                  <div
                    className={`absolute left-0 mt-2 w-56 ${themeColors["navigationHeaderBg"]} shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdowns[id]
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-3 invisible"
                    }`}
                  >
                    {sublinks.map((s) => (
                      <div
                        key={s.href}
                        className={`block px-5 py-3 ${themeColors["primaryText"]} hover:${themeColors["accentText"]} transition`}
                      >
                        <Link href={s.href}>{s.label}</Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={mainLink.href}
                href={mainLink.href}
                className={`${themeColors["primaryText"]} hover:${themeColors["accentText"]}`}
              >
                {mainLink.label}
              </Link>
            );
          })}

          {links?.map((link) => (
            <Link
              key={link.id}
              href={link.data.href}
              className={`${themeColors["primaryText"]} hover:${themeColors["accentText"]}`}
            >
              {link.data.label}
            </Link>
          ))}

          {/* CTA */}
          {callToAction && (
            <a href={callToAction.data.href}>
              <button
                className={twMerge(
                  `${themeColors["primaryButtonText"]} ${themeColors["primaryButtonBg"]} ${themeColors["primaryButtonHoverShadow"]} transition-all px-5 py-2 rounded-full cursor-pointer ${callToAction.classNames?.custom || ""}`,
                )}
              >
                {callToAction.data.label}
              </button>
            </a>
          )}
        </nav>

        {/* Mobile Menu */}
      </div>
    </header>
  );
}
