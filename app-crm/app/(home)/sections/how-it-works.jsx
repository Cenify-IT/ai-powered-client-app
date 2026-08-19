"use client";

import { Globe, Bot, Users, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: Globe,
    title: "Website Visitor Arrives",
    description: "A customer lands on your website looking for your services.",
  },
  {
    icon: Bot,
    title: "AI Answers Questions",
    description:
      "Your AI assistant instantly responds, qualifies the visitor, and collects contact information.",
  },
  {
    icon: Users,
    title: "Lead Created",
    description:
      "Qualified leads automatically appear inside your CRM with conversation history.",
  },
  {
    icon: CalendarCheck,
    title: "Book Appointments",
    description:
      "Schedule appointments, follow up with leads, and grow your business from one dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
            How It Works
          </p>

          <h2 className="text-5xl font-bold text-gray-900 mt-4">
            Let AI Handle Your First Conversation
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            From the moment someone visits your website, CenifyIT helps answer
            questions, capture leads, and organize everything in one intelligent
            CRM.
          </p>
        </div>

        <div className="relative mt-24">
          {/* Connection line */}
          <div className="hidden xl:block absolute top-14 left-0 right-0 h-0.5 bg-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto w-28 h-28 rounded-full bg-white border-4 border-blue-100 shadow-lg flex items-center justify-center relative z-10">
                    <Icon size={38} className="text-blue-600" />
                  </div>

                  <div className="mt-8">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold">
                      {index + 1}
                    </span>

                    <h3 className="text-2xl font-bold mt-5 text-gray-900">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-gray-600 leading-7">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
