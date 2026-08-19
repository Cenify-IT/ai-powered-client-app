"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "CenifyIT helped us turn website visitors into actual customers. The AI assistant answers questions even when we're busy working.",
    name: "Mike Anderson",
    company: "Anderson Plumbing",
  },
  {
    quote:
      "Before CenifyIT, we missed calls and leads after hours. Now our AI assistant captures customers automatically.",
    name: "Sarah Williams",
    company: "Williams HVAC",
  },
  {
    quote:
      "The CRM makes it easy to see every customer conversation and follow up with leads before they disappear.",
    name: "David Carter",
    company: "Carter Home Services",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[4px] text-blue-600 font-semibold">
            Testimonials
          </p>

          <h2 className="text-5xl font-bold text-gray-900 mt-4">
            Businesses Are Growing With CenifyIT
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            See how businesses are using AI to capture more customers and
            improve their daily operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-blue-500 text-blue-500"
                  />
                ))}
              </div>

              <p className="mt-6 text-gray-700 leading-8">
                "{testimonial.quote}"
              </p>

              <div className="mt-8">
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>

                <p className="text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
