import React from "react";
import dynamic from "next/dynamic";

// ✅ Hero section loads immediately
import Showcase from "./sections/showcase";
import Features from "./sections/features";
import Stats from "./sections/stats";
import HowItWorks from "./sections/how-it-works";
import Testimonials from "./sections/testimonials";
import Pricing from "./sections/pricing";
import Faqs from "./sections/faqs";
import CTA from "./sections/cta";

export default function Home() {
  return (
    <div>
      {/* Toasts */}

      {/* Hero Section */}
      <Showcase />
      <Stats />

      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Faqs />
      <CTA />
    </div>
  );
}
