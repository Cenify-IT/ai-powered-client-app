"use client";

import React from "react";
import Image from "next/image";
// import { useAIChat } from "../../context/ai-chat/context";
import { useTheme } from "../../context/theme/context";
import RichText from "../utils/RichText";
import Card from "../utils/Card";

export default function HowItWorks(props) {
  const { themeColors } = useTheme();

  const block = props;

  const heading = block.heading;
  const subheading = block.subheading;
  const cards = block.cards || [];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          {subheading && (
            <div>
              <RichText content={subheading} themeColors={themeColors} />
            </div>
          )}
          {heading && (
            <div>
              <RichText content={heading} themeColors={themeColors} />
            </div>
          )}
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-0" />

          {cards.map((card, index) => (
            <div key={index} className="relative z-10 w-full lg:w-1/3 group">
              <Card
                icon={card.icon}
                title={card.title}
                description={card.description}
                displayNumber={card.displayNumber}
                number={index + 1}
                classNames={card.classNames || {}}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA for the section */}
        {/* <div className="mt-16 text-center">
          <p className="text-slate-500 font-medium">
            Average time from chat to dispatch:{" "}
            <span className="text-blue-600 font-bold">Under 2 Minutes</span>
          </p>
        </div> */}
      </div>
    </section>
  );
}
