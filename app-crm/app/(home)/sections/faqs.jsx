"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the AI assistant work?",
    a: "Your AI assistant learns about your business, services, and frequently asked questions so it can respond to customers and capture leads.",
  },
  {
    q: "Do I need a new website?",
    a: "No. CenifyIT can work with your existing website or provide you with a new AI-powered website.",
  },
  {
    q: "Can the AI schedule appointments?",
    a: "Yes. Appointment scheduling and calendar integrations are available to help automate customer bookings.",
  },
  {
    q: "Can I see conversations with customers?",
    a: "Yes. Every AI conversation is stored inside your CRM so you can review leads and follow up.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
            FAQ
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.q} className="border border-gray-200 rounded-xl">
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold text-lg">{faq.q}</span>

                <ChevronDown
                  className={`transition ${open === index ? "rotate-180" : ""}`}
                />
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-gray-600 leading-7">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
