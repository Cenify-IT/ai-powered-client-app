"use client";

import React from "react";
import Image from "next/image";
// import { useAIChat } from "../../context/ai-chat/context";
import { useTheme } from "../../context/theme/context";
import RichText from "../utils/RichText";
import { twMerge } from "tailwind-merge";

export default function Hero(props) {
  const { themeColors } = useTheme();
  //   const { sendMessage, openChat } = useAIChat();
  console.log(themeColors);
  const theme = themeColors;

  if (!props) return null;
  const block = props;

  const heading = block.heading || "Reliable Plumbing";
  const subheading = block.subheading || "Without the Wait.";
  const description = block.description || "Description";
  const imageUrl = block.image?.url;

  const actionHandler = (action) => {
    if (action === "chat") {
      alert("Chat action triggered!");
      // openChat();
      // sendMessage({ text: "Hello from the Hero section!" });
    } else {
      alert(`Action "${action}" triggered!`);
    }
  };

  // Extract link data

  // const actionLink = block.links.find((l) => l.action === "chat");
  // const phoneLink = block.links.find((l) => l.type === "link");

  const links = block.links || [];

  return (
    <section
      className={`pt-16 pb-20 lg:pt-24 lg:pb-28 lg:max-w-[90%] mx-auto`}
      style={{ backgroundColor: themeColors.background || "#FFFFFF" }}
    >
      <div className="mx-auto px-6 lg:flex items-center gap-12">
        {/* Left Content */}
        <div className="lg:w-3/5 text-center lg:text-left">
          {subheading && (
            <div>
              <RichText content={subheading} />
            </div>
          )}
          {heading && (
            <div>
              <RichText content={heading} />
            </div>
          )}

          {description && (
            <div>
              <RichText content={description} />
            </div>
          )}

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {links.map((link) => {
              if (link.data.type === "action") {
                return (
                  <button
                    className={twMerge(
                      `${themeColors["primaryButtonText"]} ${themeColors["primaryButtonBg"]} ${themeColors["primaryButtonHoverShadow"]} transition-all px-5 py-2 rounded-full cursor-pointer ${link.classNames?.custom || ""}`,
                    )}
                    onClick={() => actionHandler(link.data.action)}
                  >
                    {/* Left Icon */}
                    {link.data.icon && link.data.iconPosition === "left" && (
                      <span className="mr-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}
                    {link.data.label}
                    {/* Right Icon */}
                    {link.data.icon && link.data.iconPosition === "right" && (
                      <span className="ml-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}
                  </button>
                );
              } else if (link.data.type === "link") {
                return (
                  <a
                    href={link.data.href || "#"}
                    className="px-8 py-4 rounded-full font-bold text-lg transition-all border-2"
                  >
                    {/* Left Icon */}
                    {link.data.icon && link.data.iconPosition === "left" && (
                      <span className="mr-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}

                    {link.data.label}

                    {/* Right Icon */}
                    {link.data.icon && link.data.iconPosition === "right" && (
                      <span className="ml-2">
                        <DynamicIcon
                          iconName={link.data.icon.name}
                          classNames={link.data.icon.classNames}
                          size={link.data.icon.size || 20}
                        />
                      </span>
                    )}
                  </a>
                );
              }
            })}
          </div>
        </div>

        {/* Right Image */}
        {imageUrl && (
          <div className="hidden lg:block lg:w-2/5">
            <div className="relative">
              <div className="rounded-3xl w-full h-[500px] flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={block.image?.alternativeText || "Hero Image"}
                  width={400}
                  height={400}
                  className="h-[100%] w-[100%]"
                  style={{ borderRadius: "1.5rem" }}
                />
              </div>

              {/* Floating "AI Active" Badge */}
              <div
                className="absolute -bottom-4 -left-4 p-4 rounded-2xl flex items-center gap-3 border-none shadow-xl bg-white"
                style={{
                  backgroundColor: themeColors.cardBg || "#FFFFFF",
                  borderColor: themeColors.cardBorder || "#E2E8F0",
                  boxShadow: `0 4px 6px -1px ${themeColors.accent}33`,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: themeColors.success || "#22C55E" }}
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: themeColors.secondaryText || "#64748B" }}
                >
                  AI Dispatcher Online
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
