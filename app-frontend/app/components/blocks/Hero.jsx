"use client";

import React from "react";
import Image from "next/image";
import { useAIChat } from "../../context/ai-chat/context";
import { useTheme } from "../../context/theme/context";
import RichText from "../utils/RichText";
import { twMerge } from "tailwind-merge";
import DynamicIcon from "../utils/DynamicIcon";

export default function Hero(props) {
  console.log("Hero Props", props);
  const { themeColors } = useTheme();
  const { sendMessage, openChat, sessionId } = useAIChat();
  console.log(themeColors);
  const theme = themeColors;

  if (!props) return null;
  const block = props;
  const client = props.client || {};

  const heading = block.heading || "Reliable Plumbing";
  const subheading = block.subheading || "Without the Wait.";
  const description = block.description || "Description";
  const imageUrl = block.image?.url;

  const classNames = block.classNames || {
    section: "pt-16 pb-20 lg:pt-24 lg:pb-28 lg:max-w-[90%] mx-auto",
    container: "mx-auto px-6 lg:flex items-center gap-12",
    content: "lg:w-3/5 text-center lg:text-left",
    image: "hidden lg:block lg:w-2/5",
    buttonContainer:
      "mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start",
  };
  console.log("Class Names");
  console.log(classNames);
  const styles = block.styles || {};

  const actionHandler = (action, payload) => {
    if (action === "chat") {
      openChat();
      // sendMessage({ text: "Hello from the Hero section!" });
      sendMessage(
        { text: payload.message },
        {
          body: {
            domain: window.location.hostname,
            sessionId: sessionId,
          },
        },
      );
    } else {
      // alert(`Action "${action}" triggered!`);
    }
  };

  // Extract link data

  // const actionLink = block.links.find((l) => l.action === "chat");
  // const phoneLink = block.links.find((l) => l.type === "link");

  const links = block.links || [];

  const getLinkHref = (link, client) => {
    switch (link.data.destination) {
      case "phone":
        return `tel:${client.twilioPhoneNumber || client.businessPhoneNumber}`;

      case "email":
        return `mailto:${client.email}`;

      case "sms":
        return `sms:${client.twilioPhoneNumber || client.businessPhoneNumber}`;

      case "external":
        return link.data.href || "#";

      default:
        return link.data.href || "#";
    }
  };

  return (
    <section
      className={twMerge(classNames.section)}
      // className="bg-red-500 h-96"
      // style={{ backgroundColor: themeColors.background || "#FFFFFF" }}
      style={styles.container}
    >
      {/* <div class="bg-red-500 w-128 md:w-64 lg:w-32 h-32"></div> */}
      <div className={twMerge(classNames.container)}>
        {/* Left Content */}
        <div className={twMerge(classNames.content)}>
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
          <div className={twMerge(classNames.buttonContainer)}>
            {links.map((link, index) => {
              if (link.data.type === "action") {
                return (
                  <button
                    className={twMerge(
                      `${themeColors["primaryButtonText"]} ${themeColors["primaryButtonBg"]} ${themeColors["primaryButtonHoverShadow"]} transition-all px-5 py-2 rounded-full cursor-pointer ${link.classNames?.custom || ""}`,
                    )}
                    key={index}
                    onClick={() =>
                      actionHandler(link.data.action, link.payload)
                    }
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
                  // <a
                  //   href={link.data.href || "#"}
                  //   className="px-8 py-4 rounded-full font-bold text-lg transition-all border-2"
                  //   key={index}
                  // >
                  //   {/* Left Icon */}
                  //   {link.data.icon && link.data.iconPosition === "left" && (
                  //     <span className="mr-2">
                  //       <DynamicIcon
                  //         iconName={link.data.icon.name}
                  //         classNames={link.data.icon.classNames}
                  //         size={link.data.icon.size || 20}
                  //       />
                  //     </span>
                  //   )}

                  //   {link.data.label}

                  //   {/* Right Icon */}
                  //   {link.data.icon && link.data.iconPosition === "right" && (
                  //     <span className="ml-2">
                  //       <DynamicIcon
                  //         iconName={link.data.icon.name}
                  //         classNames={link.data.icon.classNames}
                  //         size={link.data.icon.size || 20}
                  //       />
                  //     </span>
                  //   )}
                  // </a>
                  <a
                    href={getLinkHref(link, client)}
                    className="px-8 py-4 rounded-full font-bold text-lg transition-all border-2"
                    key={index}
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
