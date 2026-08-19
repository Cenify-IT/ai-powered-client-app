"use client";

import { MessageSquare, Users, Globe, Clock3 } from "lucide-react";

const stats = [
  {
    icon: MessageSquare,
    number: "24/7",
    title: "AI Conversations",
    description:
      "Your AI assistant answers customer questions around the clock.",
  },
  {
    icon: Users,
    number: "100%",
    title: "Lead Capture",
    description:
      "Every conversation is automatically turned into a qualified lead.",
  },
  {
    icon: Globe,
    number: "1 Dashboard",
    title: "Website + CRM",
    description: "Manage your website, leads, and AI assistant from one place.",
  },
  {
    icon: Clock3,
    number: "< 5 Min",
    title: "Setup Time",
    description: "Connect your business and start collecting leads in minutes.",
  },
];

export default function Stats() {
  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
            Why Businesses Choose CenifyIT
          </p>

          <h2 className="text-5xl font-bold text-gray-900 mt-4">
            Everything You Need To Turn Visitors Into Customers
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-8">
            Your AI assistant never sleeps. Capture leads, answer questions, and
            manage your business from one powerful dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-20">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600" size={30} />
                </div>

                <h3 className="text-4xl font-bold mt-8 text-gray-900">
                  {stat.number}
                </h3>

                <h4 className="text-xl font-semibold mt-3">{stat.title}</h4>

                <p className="text-gray-600 mt-4 leading-7">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
