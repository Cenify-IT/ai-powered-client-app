"use client";

import { Check } from "lucide-react";

const plans = [
  {
    name: "Foundation",
    price: "149",
    setup: "499",
    description:
      "Perfect for businesses that need a professional online presence and simple lead capture.",
    features: [
      "High-converting website",
      "Mobile-friendly design",
      "Hosting & maintenance",
      "Basic SEO foundation",
      "Contact form lead capture",
      "Basic AI chatbot (FAQ + simple lead capture)",
    ],
  },
  {
    name: "Lead Capture",
    price: "299",
    setup: "999",
    popular: true,
    description:
      "For businesses that want faster lead response, better qualification, and stronger conversions.",
    features: [
      "Everything in Foundation",
      "Full AI chatbot lead qualification",
      "CRM dashboard",
      "Lead pipeline management",
      "Automated lead routing",
      "Advanced chatbot trained to your business",
      "Monthly performance reporting",
    ],
  },
  {
    name: "Lead Recovery",
    price: "499",
    setup: "1499",
    description:
      "For businesses serious about recovering missed leads and maximizing every opportunity.",
    features: [
      "Everything in Lead Capture",
      "Missed call text-back automation",
      "SMS lead follow-up workflows",
      "Appointment reminders",
      "Review request automation",
      "Re-engagement campaigns",
      "Google Business Profile optimization",
      "Local SEO support",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
            Pricing
          </p>

          <h2 className="text-5xl font-bold text-gray-900 mt-4">
            Choose The Plan That Fits Your Business
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Start with the tools you need today and upgrade as your business
            grows.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 transition hover:shadow-xl ${
                plan.popular
                  ? "border-4 border-blue-600 shadow-2xl"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>

              <div className="mt-6">
                <span className="text-5xl font-bold">${plan.price}</span>

                <span className="text-gray-500">/month</span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                + ${plan.setup} one-time setup
              </p>

              <p className="text-gray-600 mt-6 leading-7">{plan.description}</p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 items-start">
                    <Check
                      size={20}
                      className="text-blue-600 mt-1 flex-shrink-0"
                    />

                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
                Get Started
              </button>

              <p className="text-xs text-gray-500 mt-6 leading-5">
                No long-term contracts. Cancel anytime. Setup fee may vary based
                on customization needs.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
