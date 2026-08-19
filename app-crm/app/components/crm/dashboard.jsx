"use client";

import {
  Users,
  MessageSquare,
  Globe,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "New Leads",
    value: "12",
    change: "+18%",
    icon: Users,
    description: "vs last week",
  },
  {
    title: "AI Conversations",
    value: "48",
    change: "+24%",
    icon: MessageSquare,
    description: "this week",
  },
  {
    title: "Website Visitors",
    value: "1,204",
    change: "+12%",
    icon: Globe,
    description: "this month",
  },
  {
    title: "Conversion Rate",
    value: "34%",
    change: "+5%",
    icon: TrendingUp,
    description: "from visitors",
  },
];

const recentLeads = [
  {
    name: "John Smith",
    service: "Water Heater Repair",
    status: "New",
    time: "10 minutes ago",
  },
  {
    name: "Sarah Johnson",
    service: "Bathroom Plumbing",
    status: "Contacted",
    time: "2 hours ago",
  },
  {
    name: "Mike Adams",
    service: "Emergency Repair",
    status: "Quote Sent",
    time: "Yesterday",
  },
];

const conversations = [
  {
    question: "Do you install tankless water heaters?",
    lead: "John Smith",
  },
  {
    question: "Can I get an estimate for a remodel?",
    lead: "Sarah Johnson",
  },
  {
    question: "Do you offer weekend appointments?",
    lead: "Anonymous Visitor",
  },
];

export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Good Morning 👋</h1>

        <p className="text-gray-500 mt-2">
          Here is what is happening with your business today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h2 className="text-3xl font-bold mt-2 text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <Icon size={22} className="text-blue-600" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-green-600 text-sm font-semibold">
                  {stat.change}
                </span>

                <span className="text-gray-400 text-sm">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Recent Leads */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="font-semibold text-lg">Recent Leads</h2>

            <button className="text-blue-600 text-sm flex items-center gap-1">
              View All
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="divide-y">
            {recentLeads.map((lead) => (
              <div key={lead.name} className="p-5 flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>

                  <p className="text-sm text-gray-500">{lead.service}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {lead.status}
                  </span>

                  <p className="text-xs text-gray-400 mt-2">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Conversations */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="font-semibold text-lg">AI Conversations</h2>

            <button className="text-blue-600 text-sm">View Chat</button>
          </div>

          <div className="divide-y">
            {conversations.map((chat) => (
              <div key={chat.question} className="p-5">
                <p className="text-gray-800">"{chat.question}"</p>

                <p className="text-sm text-gray-500 mt-2">{chat.lead}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Insight */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <CalendarDays size={28} />

          <div>
            <h3 className="font-semibold text-lg">AI Business Insight</h3>

            <p className="mt-2 text-blue-100">
              Your AI assistant generated 12 leads this week. Most customers are
              asking about emergency plumbing services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
