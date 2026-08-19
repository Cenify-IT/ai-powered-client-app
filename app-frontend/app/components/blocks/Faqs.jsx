"use client";
import RichText from "../utils/RichText";
import DynamicIcon from "../utils/DynamicIcon";
import { useTheme } from "../../context/theme/context";
import { twMerge } from "tailwind-merge";
import React from "react";
import Accordion from "../utils/Accordion";
export default function Faqs(props) {
  console.log("Props", props);
  const { themeColors } = useTheme();
  const block = props || {};

  const heading = block.heading;
  const subheading = block.subheading || "";
  //   const additionalInfo = block.additional || "";

  const faqData = block.faqs || [];

  // const faqs = faqData.map((item) => ({
  //   id: item.id,
  //   question: item.question,
  //   answer: (
  //     <div className="space-y-3">
  //       {item.content.map((block, index) => (
  //         <RichText key={index} content={block} themeColors={themeColors} />
  //       ))}
  //     </div>
  //   ),
  // }));
  const faqs = faqData.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    icon: item.icon || null,
  }));

  const classes = block.classNames || {
    sectionBgColor: "bg-white",
    sectionPaddingY: "py-10",
    sectionPaddingX: "px-6",
    containerPaddingX: "px-6",
    containerPaddingY: "py-12",
  };

  //   const links = block.ctaLinks || [];

  return (
    <section
      className={`relative ${classes.sectionPaddingY} ${classes.sectionPaddingX} ${classes.sectionBgColor} `}
    >
      <div
        className={`container mx-auto ${classes.containerPaddingX}  ${classes.containerPaddingY} ${classes.custom}`}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Heading */}
          <RichText content={heading} />

          {/* Subheading */}
          <RichText content={subheading} />

          {/* Additional Info */}
        </div>
        <div className="mt-10 max-w-4xl mx-auto">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
