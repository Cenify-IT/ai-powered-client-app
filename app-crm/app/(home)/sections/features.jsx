"use client";

import {
  Bot,
  Users,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Customer Assistant",
    description:
      "Respond instantly to customer questions, qualify leads, and capture contact information 24/7.",
  },
  {
    icon: Users,
    title: "Lead Management",
    description:
      "Automatically organize every lead from your website, forms, and AI conversations into one pipeline.",
  },
  {
    icon: MessageSquare,
    title: "Smart Conversations",
    description:
      "View every customer interaction in one inbox and never lose track of an important conversation.",
  },
  {
    icon: CalendarDays,
    title: "Appointments",
    description:
      "Manage consultations, follow-ups, and upcoming appointments from one simple dashboard.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Track website performance, lead generation, and customer growth with real-time insights.",
  },
  {
    icon: Workflow,
    title: "Automations",
    description:
      "Automate repetitive tasks and customer follow-ups so you can focus on growing your business.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Features
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything You Need to Grow Your Business
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            CenifyIT CRM combines customer management, AI, conversations,
            appointments, and analytics into one modern platform designed for
            growing businesses.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 transition group-hover:bg-blue-600">
                  <Icon className="h-7 w-7 text-blue-600 transition group-hover:text-white" />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
