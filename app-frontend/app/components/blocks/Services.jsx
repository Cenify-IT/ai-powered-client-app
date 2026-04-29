"use client";

import React from "react";
import Image from "next/image";
// import { useAIChat } from "../../context/ai-chat/context";
import { useTheme } from "../../context/theme/context";
import RichText from "../utils/RichText";
import Card from "../utils/Card";

export default function Services(props) {
  const block = props;

  const heading = block.heading;
  const description = block.description;
  const services = block.cards || [];

  return (
    <div>
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <RichText content={heading} />
            <RichText content={description} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                icon={service.icon}
                title={service.title}
                description={service.description}
                displayNumber={service.displayNumber}
                number={index + 1}
                classNames={service.classNames || {}}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
