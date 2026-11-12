"use client";

import Link from "next/link";
import { useWebsite } from "../../context/website/context";
import { useEffect } from "react";

export default function DashboardPage(props) {
  const { getWebsiteData } = useWebsite();

  useEffect(() => {
    // Fetch website data when the component mounts
    const fetchData = async () => {
      try {
        const res = await getWebsiteData();
        console.log("Website Data:", res);
      } catch (error) {
        console.error("Error fetching website data:", error);
      }
    };
    fetchData();
  }, []);

  const { websiteData, leads, chatbotConversations } = useWebsite();

  const newLeads = leads ? leads.filter((lead) => lead.stage === "new") : [];
  const openLeads = leads
    ? leads.filter(
        (lead) => lead.stage !== "contacted" && lead.stage !== "lost",
      )
    : [];

  const aiConversationsCount = chatbotConversations?.meta.pagination.total
    ? chatbotConversations.meta.pagination.total
    : 0;

  const formSubmissionsCount =
    websiteData?.data?.[0]?.form_submissions?.length ?? 0;

  const visitorCount = websiteData?.data?.[0]?.visitorCount ?? 0;

  console.log("AI Conversations Count:", aiConversationsCount);
  console.log("newLeads:", newLeads);
  console.log("openLeads:", openLeads);
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
            ["New Leads", newLeads.length.toString()],
            ["Open Leads", openLeads.length.toString()],
            ["AI Conversations", aiConversationsCount?.toString() || "0"],
            [
              "Chatbot Conversion Rate",
              leads
                ? `${Math.round((leads.length / aiConversationsCount) * 100)}%`
                : "N/A",
            ],
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
              {newLeads.reverse().map((lead, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold">
                      {lead.name?.length > 0 ? lead.name : "Name not Provided"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {lead.source
                        ?.split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(" ")}
                    </p>
                    {lead.source === "website_chatbot" ? (
                      <p className="text-sm text-gray-500">
                        {lead.chatbot_intent
                          ? lead.chatbot_intent.name
                          : "No intent detected"}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {lead.stage
                      ?.split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")}
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
                <p className="font-medium">
                  📈 {newLeads.length} new leads today
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="font-medium">
                  💬{" "}
                  {aiConversationsCount !== undefined
                    ? aiConversationsCount
                    : 0}{" "}
                  chatbot conversations
                </p>
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="font-medium">
                  ⚠️{" "}
                  {leads
                    ? leads.filter((lead) => lead.followUpRequired).length
                    : 0}{" "}
                  leads need follow-up
                </p>
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
                <strong>{visitorCount}</strong>
              </div>

              <div className="flex justify-between">
                <span>AI Conversations</span>
                <strong>{aiConversationsCount}</strong>
              </div>

              <div className="flex justify-between">
                <span>Forms Submitted</span>
                <strong>{formSubmissionsCount}</strong>
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
