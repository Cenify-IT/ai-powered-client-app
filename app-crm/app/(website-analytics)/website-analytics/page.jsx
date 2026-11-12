"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bot,
  CalendarDays,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Globe,
  Laptop,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
  UserPlus,
  Zap,
} from "lucide-react";

import { useWebsite } from "../../context/website/context";

/* =========================================================
   HELPERS
========================================================= */

const formatNumber = (value) => {
  if (value === null || value === undefined) return "0";

  return new Intl.NumberFormat("en-US").format(value);
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return "0%";

  return `${Number(value).toFixed(1)}%`;
};

const formatChange = (value) => {
  if (value === null || value === undefined) return "0%";

  const number = Number(value);

  return `${number > 0 ? "+" : ""}${number.toFixed(1)}%`;
};

const getChangeStyles = (change) => {
  if (Number(change) > 0) {
    return {
      container: "bg-green-50 text-green-700",
      icon: ArrowUp,
    };
  }

  if (Number(change) < 0) {
    return {
      container: "bg-red-50 text-red-700",
      icon: ArrowDown,
    };
  }

  return {
    container: "bg-gray-100 text-gray-600",
    icon: Activity,
  };
};

const formatDateLabel = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

/* =========================================================
   DEMO / FALLBACK DATA

   Replace this with your API response later.
========================================================= */

const fallbackAnalytics = {
  overview: {
    visitors: 1284,
    visitorsChange: 18.4,

    pageViews: 3472,
    pageViewsChange: 12.8,

    leads: 86,
    leadsChange: 24.6,

    conversionRate: 6.7,
    conversionRateChange: 0.9,
  },

  traffic: [
    {
      date: "2026-09-01",
      visitors: 32,
      pageViews: 91,
    },
    {
      date: "2026-09-02",
      visitors: 45,
      pageViews: 117,
    },
    {
      date: "2026-09-03",
      visitors: 38,
      pageViews: 104,
    },
    {
      date: "2026-09-04",
      visitors: 52,
      pageViews: 139,
    },
    {
      date: "2026-09-05",
      visitors: 61,
      pageViews: 158,
    },
    {
      date: "2026-09-06",
      visitors: 49,
      pageViews: 126,
    },
    {
      date: "2026-09-07",
      visitors: 73,
      pageViews: 192,
    },
    {
      date: "2026-09-08",
      visitors: 67,
      pageViews: 174,
    },
    {
      date: "2026-09-09",
      visitors: 81,
      pageViews: 209,
    },
    {
      date: "2026-09-10",
      visitors: 76,
      pageViews: 201,
    },
    {
      date: "2026-09-11",
      visitors: 92,
      pageViews: 243,
    },
    {
      date: "2026-09-12",
      visitors: 88,
      pageViews: 227,
    },
    {
      date: "2026-09-13",
      visitors: 94,
      pageViews: 251,
    },
    {
      date: "2026-09-14",
      visitors: 101,
      pageViews: 267,
    },
  ],

  leads: [
    {
      date: "2026-09-01",
      leads: 3,
    },
    {
      date: "2026-09-02",
      leads: 4,
    },
    {
      date: "2026-09-03",
      leads: 2,
    },
    {
      date: "2026-09-04",
      leads: 5,
    },
    {
      date: "2026-09-05",
      leads: 6,
    },
    {
      date: "2026-09-06",
      leads: 3,
    },
    {
      date: "2026-09-07",
      leads: 7,
    },
    {
      date: "2026-09-08",
      leads: 5,
    },
    {
      date: "2026-09-09",
      leads: 8,
    },
    {
      date: "2026-09-10",
      leads: 6,
    },
    {
      date: "2026-09-11",
      leads: 9,
    },
    {
      date: "2026-09-12",
      leads: 8,
    },
    {
      date: "2026-09-13",
      leads: 10,
    },
    {
      date: "2026-09-14",
      leads: 10,
    },
  ],

  trafficSources: [
    {
      name: "Google",
      visitors: 542,
      percentage: 42.2,
    },
    {
      name: "Direct",
      visitors: 318,
      percentage: 24.8,
    },
    {
      name: "Facebook",
      visitors: 176,
      percentage: 13.7,
    },
    {
      name: "Instagram",
      visitors: 128,
      percentage: 10.0,
    },
    {
      name: "Referral",
      visitors: 76,
      percentage: 5.9,
    },
    {
      name: "Other",
      visitors: 44,
      percentage: 3.4,
    },
  ],

  topPages: [
    {
      path: "/",
      title: "Home",
      views: 1248,
      visitors: 681,
      leads: 32,
    },
    {
      path: "/emergency-plumbing",
      title: "Emergency Plumbing",
      views: 723,
      visitors: 482,
      leads: 24,
    },
    {
      path: "/drain-cleaning",
      title: "Drain Cleaning",
      views: 481,
      visitors: 291,
      leads: 12,
    },
    {
      path: "/water-heaters",
      title: "Water Heaters",
      views: 394,
      visitors: 243,
      leads: 9,
    },
    {
      path: "/leak-detection",
      title: "Leak Detection",
      views: 281,
      visitors: 174,
      leads: 6,
    },
  ],

  chatbot: {
    conversations: 214,
    conversationsChange: 31.2,

    leads: 42,
    leadsChange: 27.3,

    conversionRate: 19.6,

    messages: 843,

    avgMessagesPerConversation: 3.9,
  },

  devices: [
    {
      name: "Mobile",
      value: 68,
      icon: Smartphone,
    },
    {
      name: "Desktop",
      value: 27,
      icon: Monitor,
    },
    {
      name: "Tablet",
      value: 5,
      icon: Tablet,
    },
  ],

  recentActivity: [
    {
      type: "lead",
      title: "New lead captured",
      description: "John Smith submitted a service request",
      timestamp: "5 minutes ago",
    },
    {
      type: "chat",
      title: "Chatbot conversation",
      description: "Visitor asked about emergency plumbing",
      timestamp: "18 minutes ago",
    },
    {
      type: "page",
      title: "Page viewed",
      description: "Emergency Plumbing",
      timestamp: "27 minutes ago",
    },
    {
      type: "lead",
      title: "New lead captured",
      description: "Sarah Johnson started a website conversation",
      timestamp: "42 minutes ago",
    },
    {
      type: "chat",
      title: "Chatbot conversation",
      description: "Visitor asked about water heater repair",
      timestamp: "1 hour ago",
    },
  ],
};

/* =========================================================
   COMPONENTS
========================================================= */

function MetricCard({ title, value, change, icon: Icon, description }) {
  const changeStyles = getChangeStyles(change);
  const ChangeIcon = changeStyles.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${changeStyles.container}`}
        >
          <ChangeIcon className="h-3 w-3" />

          {formatChange(change)}
        </span>

        <span className="text-xs text-gray-400">
          {description || "vs. previous period"}
        </span>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>

      <div>
        <h2 className="font-semibold text-gray-900">{title}</h2>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function SimpleLineChart({ data }) {
  const chartWidth = 900;
  const chartHeight = 300;

  const padding = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 45,
  };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxValue =
    Math.max(
      ...data.map((item) =>
        Math.max(Number(item.visitors) || 0, Number(item.pageViews) || 0),
      ),
    ) || 1;

  const getX = (index) => {
    if (data.length <= 1) return padding.left;

    return padding.left + (index / (data.length - 1)) * innerWidth;
  };

  const getY = (value) => {
    return (
      padding.top +
      innerHeight -
      ((Number(value) || 0) / maxValue) * innerHeight
    );
  };

  const createPath = (key) => {
    return data
      .map((item, index) => {
        const x = getX(index);
        const y = getY(item[key]);

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-[300px] w-full"
        preserveAspectRatio="none"
      >
        {/* Grid */}
        {gridLines.map((percentage) => {
          const y = padding.top + innerHeight - percentage * innerHeight;

          return (
            <g key={percentage}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-gray-100"
              />

              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-[10px]"
              >
                {Math.round(maxValue * percentage)}
              </text>
            </g>
          );
        })}

        {/* Page Views */}
        <path
          d={createPath("pageViews")}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        />

        {/* Visitors */}
        <path
          d={createPath("visitors")}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500"
        />

        {/* Visitor points */}
        {data.map((item, index) => (
          <circle
            key={`visitor-${index}`}
            cx={getX(index)}
            cy={getY(item.visitors)}
            r="3.5"
            className="fill-purple-500"
          />
        ))}

        {/* Page view points */}
        {data.map((item, index) => (
          <circle
            key={`page-${index}`}
            cx={getX(index)}
            cy={getY(item.pageViews)}
            r="3.5"
            className="fill-blue-500"
          />
        ))}

        {/* X labels */}
        {data.map((item, index) => {
          if (
            data.length > 8 &&
            index % Math.ceil(data.length / 7) !== 0 &&
            index !== data.length - 1
          ) {
            return null;
          }

          return (
            <text
              key={`label-${index}`}
              x={getX(index)}
              y={chartHeight - 12}
              textAnchor="middle"
              className="fill-gray-400 text-[10px]"
            >
              {formatDateLabel(item.date)}
            </text>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-center gap-5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Page Views
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
          Visitors
        </div>
      </div>
    </div>
  );
}

function LeadChart({ data }) {
  const maxValue =
    Math.max(...data.map((item) => Number(item.leads) || 0)) || 1;

  return (
    <div className="flex h-[300px] items-end gap-2 overflow-hidden px-2">
      {data.map((item, index) => {
        const height = ((Number(item.leads) || 0) / maxValue) * 100;

        return (
          <div
            key={item.date || index}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <div className="group relative flex h-full w-full items-end justify-center">
              <div
                className="w-full max-w-8 rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                style={{
                  height: `${Math.max(height, 4)}%`,
                }}
              >
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-gray-900 px-2 py-1 text-[10px] font-medium text-white group-hover:block">
                  {item.leads} leads
                </div>
              </div>
            </div>

            {(data.length <= 8 ||
              index % Math.ceil(data.length / 7) === 0 ||
              index === data.length - 1) && (
              <span className="text-[10px] text-gray-400">
                {formatDateLabel(item.date)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrafficSources({ sources }) {
  return (
    <div className="space-y-5">
      {sources.map((source) => (
        <div key={source.name}>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />

              <span className="text-sm font-medium text-gray-700">
                {source.name}
              </span>
            </div>

            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(source.visitors)}
              </span>

              <span className="ml-2 text-xs text-gray-400">
                {source.percentage}%
              </span>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${source.percentage}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DeviceBreakdown({ devices }) {
  return (
    <div className="space-y-5">
      {devices.map((device) => {
        const Icon = device.icon;

        return (
          <div key={device.name}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-400" />

                <span className="text-sm font-medium text-gray-700">
                  {device.name}
                </span>
              </div>

              <span className="text-sm font-semibold text-gray-900">
                {device.value}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{
                  width: `${device.value}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityIcon({ type }) {
  if (type === "lead") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
        <UserPlus className="h-4 w-4" />
      </div>
    );
  }

  if (type === "chat") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
        <MessageSquare className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
      <Eye className="h-4 w-4" />
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AnalyticsPage() {
  const { getWebsiteData } = useWebsite();

  const [websiteData, setWebsiteData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(fallbackAnalytics);

  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getWebsiteData();

        console.log("Website Analytics Data:", res);

        setWebsiteData(res?.data?.websiteData || null);

        /*
         * When the Strapi analytics endpoint is ready,
         * replace this fallback with:
         *
         * setAnalyticsData(res.data.analyticsData);
         */

        if (res?.data?.analyticsData) {
          setAnalyticsData(res.data.analyticsData);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedRangeLabel = useMemo(() => {
    switch (dateRange) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      default:
        return "Last 30 days";
    }
  }, [dateRange]);

  const overview = analyticsData?.overview || fallbackAnalytics.overview;

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-0 flex-col bg-gray-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Website Analytics
              </h1>

              {!loading && (
                <span className="hidden rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 sm:inline-flex">
                  Live data
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Understand how visitors interact with your website and turn
              traffic into leads.
            </p>
          </div>

          {/* Date Range */}
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          {/* =================================================
              OVERVIEW
          ================================================== */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Overview</h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  {selectedRangeLabel}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Visitors"
                value={formatNumber(overview.visitors)}
                change={overview.visitorsChange}
                icon={Users}
              />

              <MetricCard
                title="Page Views"
                value={formatNumber(overview.pageViews)}
                change={overview.pageViewsChange}
                icon={Eye}
              />

              <MetricCard
                title="Leads"
                value={formatNumber(overview.leads)}
                change={overview.leadsChange}
                icon={UserPlus}
              />

              <MetricCard
                title="Lead Conversion"
                value={formatPercent(overview.conversionRate)}
                change={overview.conversionRateChange}
                icon={TrendingUp}
              />
            </div>
          </section>

          {/* =================================================
              TRAFFIC
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-2">
              <SectionHeader
                icon={BarChart3}
                title="Website Traffic"
                description="Visitors and page views over time"
              />

              <SimpleLineChart
                data={analyticsData?.traffic || fallbackAnalytics.traffic}
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <SectionHeader
                icon={TrendingUp}
                title="Lead Generation"
                description="Leads captured over time"
              />

              <LeadChart
                data={analyticsData?.leads || fallbackAnalytics.leads}
              />
            </div>
          </section>

          {/* =================================================
              SOURCES + DEVICES
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <SectionHeader
                icon={MousePointerClick}
                title="Traffic Sources"
                description="Where your visitors are coming from"
              />

              <TrafficSources
                sources={
                  analyticsData?.trafficSources ||
                  fallbackAnalytics.trafficSources
                }
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <SectionHeader
                icon={Laptop}
                title="Devices"
                description="How visitors access your website"
              />

              <DeviceBreakdown
                devices={analyticsData?.devices || fallbackAnalytics.devices}
              />
            </div>
          </section>

          {/* =================================================
              CHATBOT
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SectionHeader
                icon={Bot}
                title="AI Chatbot Performance"
                description="See how your chatbot is turning visitors into leads"
              />

              <div className="hidden items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 sm:flex">
                <Zap className="h-3.5 w-3.5" />
                AI Powered
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <div className="rounded-xl bg-gray-50 p-4">
                <MessageSquare className="h-5 w-5 text-purple-500" />

                <p className="mt-3 text-xs text-gray-500">Conversations</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatNumber(analyticsData?.chatbot?.conversations || 0)}
                </p>

                <p className="mt-1 text-xs font-medium text-green-600">
                  +{analyticsData?.chatbot?.conversationsChange || 0}%
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <UserPlus className="h-5 w-5 text-green-500" />

                <p className="mt-3 text-xs text-gray-500">Leads Captured</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatNumber(analyticsData?.chatbot?.leads || 0)}
                </p>

                <p className="mt-1 text-xs font-medium text-green-600">
                  +{analyticsData?.chatbot?.leadsChange || 0}%
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <TrendingUp className="h-5 w-5 text-blue-500" />

                <p className="mt-3 text-xs text-gray-500">Lead Conversion</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatPercent(analyticsData?.chatbot?.conversionRate || 0)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <MessageSquare className="h-5 w-5 text-orange-500" />

                <p className="mt-3 text-xs text-gray-500">Messages</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatNumber(analyticsData?.chatbot?.messages || 0)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <Activity className="h-5 w-5 text-gray-500" />

                <p className="mt-3 text-xs text-gray-500">Avg. Messages</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {Number(
                    analyticsData?.chatbot?.avgMessagesPerConversation || 0,
                  ).toFixed(1)}
                </p>

                <p className="mt-1 text-xs text-gray-400">per conversation</p>
              </div>
            </div>
          </section>

          {/* =================================================
              TOP PAGES
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeader
              icon={FileText}
              title="Top Pages"
              description="Pages receiving the most traffic"
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Page
                    </th>

                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                      Views
                    </th>

                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                      Visitors
                    </th>

                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                      Leads
                    </th>

                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                      Conversion
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(analyticsData?.topPages || fallbackAnalytics.topPages).map(
                    (page) => {
                      const conversion =
                        page.visitors > 0
                          ? (page.leads / page.visitors) * 100
                          : 0;

                      return (
                        <tr
                          key={page.path}
                          className="border-b border-gray-50 last:border-0"
                        >
                          <td className="py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {page.title}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {page.path}
                              </p>
                            </div>
                          </td>

                          <td className="py-4 text-right text-sm font-medium text-gray-700">
                            {formatNumber(page.views)}
                          </td>

                          <td className="py-4 text-right text-sm font-medium text-gray-700">
                            {formatNumber(page.visitors)}
                          </td>

                          <td className="py-4 text-right text-sm font-semibold text-gray-900">
                            {formatNumber(page.leads)}
                          </td>

                          <td className="py-4 text-right">
                            <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                              {formatPercent(conversion)}
                            </span>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* =================================================
              RECENT ACTIVITY
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeader
              icon={Clock}
              title="Recent Activity"
              description="Latest activity across your website"
            />

            <div className="space-y-4">
              {(
                analyticsData?.recentActivity ||
                fallbackAnalytics.recentActivity
              ).map((activity, index) => (
                <div
                  key={`${activity.title}-${index}`}
                  className="flex items-center gap-3"
                >
                  <ActivityIcon type={activity.type} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {activity.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-gray-400">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
