"use client";

import Image from "next/image";

export default function Showcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
        {/* Badge */}
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          AI-Powered CRM
        </span>

        {/* Heading */}
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
          Manage Leads, Customers & AI Conversations
          <span className="text-blue-600"> in One Place.</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
          CenifyIT CRM helps you capture leads, manage customer relationships,
          track appointments, and monitor your AI chatbot—all from a single,
          modern dashboard.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/login"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Log In
          </a>

          <a
            href="/signup"
            className="rounded-xl border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Start Free Trial
          </a>
        </div>

        {/* Dashboard Placeholder */}
        <div className="mt-20 w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          {/* Replace with actual dashboard screenshot later */}
          <div className="flex h-[500px] items-center justify-center bg-gray-100 text-lg text-gray-400">
            Dashboard Preview Coming Soon
          </div>

          {/* Example:
          <Image
            src="/assets/images/dashboard-preview.webp"
            alt="CenifyIT CRM Dashboard"
            width={1400}
            height={900}
            className="w-full h-auto"
            priority
          />
          */}
        </div>
      </div>
    </section>
  );
}
