"use client";

export default function CTA() {
  return (
    <section className="py-32 bg-blue-600">
      <div className="max-w-5xl mx-auto px-6 text-center text-white">
        <h2 className="text-5xl font-bold">
          Ready To Turn More Visitors Into Customers?
        </h2>

        <p className="mt-6 text-xl text-blue-100">
          Let CenifyIT build your AI-powered website and CRM that works for your
          business 24/7.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
            Start Growing
          </button>

          <button className="border border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
            Book A Demo
          </button>
        </div>
      </div>
    </section>
  );
}
