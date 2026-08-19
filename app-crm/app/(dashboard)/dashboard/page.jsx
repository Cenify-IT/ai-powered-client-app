"use client";

import Link from "next/link";

export default function DashboardPage(props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Good Morning 👋</h1>

          <p className="mt-2 text-gray-500">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["New Leads", "12"],
            ["Open Leads", "18"],
            ["AI Conversations", "46"],
            ["Conversion Rate", "32%"],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <p className="text-gray-500">{title}</p>

              <h2 className="mt-3 text-4xl font-bold">{value}</h2>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {/* Recent Leads */}
          <div className="rounded-2xl border bg-white p-6 xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Leads</h2>

              <Link href="/leads" className="text-sm font-medium text-blue-600">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "John Smith",
                  service: "Plumbing Quote",
                  status: "New",
                },
                {
                  name: "Sarah Jones",
                  service: "Water Heater",
                  status: "Contacted",
                },
                {
                  name: "Mike Brown",
                  service: "Emergency Repair",
                  status: "Won",
                },
              ].map((lead) => (
                <div
                  key={lead.name}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold">{lead.name}</p>

                    <p className="text-sm text-gray-500">{lead.service}</p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-semibold">AI Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="font-medium">📈 12 new leads today</p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="font-medium">💬 46 chatbot conversations</p>
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="font-medium">⚠️ 3 leads need follow-up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold">Lead Pipeline</h2>

            <div className="flex h-72 items-center justify-center rounded-xl border-2 border-dashed text-gray-400">
              Pipeline Chart
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold">Website Performance</h2>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span>Visitors</span>
                <strong>2,341</strong>
              </div>

              <div className="flex justify-between">
                <span>AI Conversations</span>
                <strong>93</strong>
              </div>

              <div className="flex justify-between">
                <span>Forms Submitted</span>
                <strong>28</strong>
              </div>

              <div className="flex justify-between">
                <span>Conversion Rate</span>
                <strong>32%</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
