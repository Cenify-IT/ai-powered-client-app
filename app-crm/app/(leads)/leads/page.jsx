"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  UserRound,
  Calendar,
  X,
} from "lucide-react";
import { useWebsite } from "../../context/website/context";
import { useEffect } from "react";

const handleCallClick = (phoneNumber) => {
  if (phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
  }

  console.log("Calling:", phoneNumber);
};

const handleTextClick = (phoneNumber) => {
  if (phoneNumber) {
    window.location.href = `sms:${phoneNumber}`;
  }
  console.log("Texting:", phoneNumber);
};

const handleEmailClick = (email) => {
  if (email) {
    window.location.href = `mailto:${email}`;
  }
  console.log("Emailing:", email);
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "—";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSource = (source) => {
  if (!source) return "Unknown";

  return source
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatStage = (stage) => {
  if (!stage) return "Unknown";

  return stage.charAt(0).toUpperCase() + stage.slice(1);
};

const stageStyles = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-100",
  qualified: "bg-green-50 text-green-700 border-green-100",
  converted: "bg-purple-50 text-purple-700 border-purple-100",
  lost: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function LeadsPage(props) {
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

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);

  const totalLeads = leads?.length;

  const newLeads = leads?.filter(
    (lead) => lead.stage?.toLowerCase() === "new",
  ).length;

  const contactedLeads = leads?.filter(
    (lead) => lead.stage?.toLowerCase() === "contacted",
  ).length;

  const qualifiedLeads = leads?.filter(
    (lead) => lead.stage?.toLowerCase() === "qualified",
  ).length;

  const sources = useMemo(() => {
    return [...new Set(leads?.map((lead) => lead.source).filter(Boolean))];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return leads?.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        lead.name?.toLowerCase().includes(searchValue) ||
        lead.email?.toLowerCase().includes(searchValue) ||
        lead.phoneNumber?.includes(searchValue) ||
        lead.zipCode?.toLowerCase().includes(searchValue) ||
        lead.chatbot_intent?.name?.toLowerCase().includes(searchValue);

      const matchesStage =
        stageFilter === "all" ||
        lead.stage?.toLowerCase() === stageFilter.toLowerCase();

      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;

      return matchesSearch && matchesStage && matchesSource;
    });
  }, [leads, search, stageFilter, sourceFilter]);

  const clearFilters = () => {
    setSearch("");
    setStageFilter("all");
    setSourceFilter("all");
  };

  const hasFilters = search || stageFilter !== "all" || sourceFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and follow up with leads from your website.
            </p>
          </div>

          {websiteData?.businessName && (
            <div className="text-sm text-gray-500">
              {websiteData.businessName}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Leads</p>

          <p className="mt-1 text-2xl font-bold text-gray-900">{totalLeads}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">New</p>

          <p className="mt-1 text-2xl font-bold text-blue-600">{newLeads}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Contacted</p>

          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {contactedLeads}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Qualified</p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {qualifiedLeads}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Stage Filter */}
          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Source Filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Sources</option>

              {sources.map((source) => (
                <option key={source} value={source}>
                  {formatSource(source)}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lead
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Source
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Intent
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stage
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredLeads && filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const stage = lead.stage?.toLowerCase() || "unknown";
                  const isUnseen = !lead.seenAt;

                  return (
                    <tr
                      key={lead.documentId || lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition hover:bg-gray-50 ${
                        isUnseen ? "bg-blue-50/30" : ""
                      }`}
                    >
                      {/* Lead */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <UserRound size={18} />

                            {isUnseen && (
                              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {lead.name ||
                                lead.email ||
                                formatPhoneNumber(lead.phoneNumber) ||
                                "Unknown Lead"}
                            </p>

                            {lead.zipCode && (
                              <p className="text-xs text-gray-500">
                                {lead.zipCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {lead.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              {formatPhoneNumber(lead.phoneNumber)}
                            </div>
                          )}

                          {lead.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />
                              {lead.email}
                            </div>
                          )}

                          {!lead.phoneNumber && !lead.email && (
                            <span className="text-sm text-gray-400">
                              No contact information
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">
                          {formatSource(lead.source)}
                        </span>
                      </td>

                      {/* Intent */}
                      <td className="max-w-[250px] px-5 py-4">
                        <p className="truncate text-sm text-gray-700">
                          {lead.chatbot_intent?.name || "—"}
                        </p>
                      </td>

                      {/* Stage */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            stageStyles[stage] ||
                            "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                        >
                          {formatStage(lead.stage)}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          {formatDate(lead.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <UserRound className="text-gray-400" size={22} />
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900">
                        No leads found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {hasFilters
                          ? "Try adjusting your search or filters."
                          : "Leads generated from your website will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-gray-100 md:hidden">
          {filteredLeads && filteredLeads.length > 0 ? (
            filteredLeads.reverse().map((lead) => {
              const stage = lead.stage?.toLowerCase() || "unknown";
              const isUnseen = !lead.seenAt;

              return (
                <button
                  key={lead.documentId || lead.id}
                  type="button"
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full p-4 text-left transition hover:bg-gray-50 ${
                    isUnseen ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <UserRound size={18} />

                      {isUnseen && (
                        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {lead.name ||
                              lead.email ||
                              formatPhoneNumber(lead.phoneNumber) ||
                              "Unknown Lead"}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {formatSource(lead.source)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${
                            stageStyles[stage] ||
                            "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                        >
                          {formatStage(lead.stage)}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        {lead.phoneNumber && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone size={13} />
                            {formatPhoneNumber(lead.phoneNumber)}
                          </div>
                        )}

                        {lead.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail size={13} />
                            {lead.email}
                          </div>
                        )}

                        {lead.chatbot_intent?.name && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MessageSquare size={13} />
                            <span className="truncate">
                              {lead.chatbot_intent.name}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
                          <Calendar size={13} />
                          {formatDate(lead.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <UserRound className="text-gray-400" size={22} />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-gray-900">
                No leads found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {hasFilters
                  ? "Try adjusting your search or filters."
                  : "Leads generated from your website will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mt-3 text-sm text-gray-500">
        Showing {filteredLeads && filteredLeads.length} of{" "}
        {leads && leads.length} leads
      </div>

      {/* Selected Lead Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close lead details"
            onClick={() => setSelectedLead(null)}
            className="absolute inset-0 bg-black/30"
          />

          {/* Panel */}
          <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Lead Details
                </h2>

                <p className="text-xs text-gray-500">
                  {selectedLead.documentId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Lead Identity */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <UserRound size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedLead.name ||
                      selectedLead.email ||
                      formatPhoneNumber(selectedLead.phoneNumber) ||
                      "Unknown Lead"}
                  </h3>

                  <span
                    className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                      stageStyles[selectedLead.stage?.toLowerCase()] ||
                      "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {formatStage(selectedLead.stage)}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Contact Information
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={17} className="text-gray-400" />

                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm text-gray-800">
                        {formatPhoneNumber(selectedLead.phoneNumber)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={17} className="text-gray-400" />

                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm text-gray-800">
                        {selectedLead.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageSquare size={17} className="text-gray-400" />

                    <div>
                      <p className="text-xs text-gray-400">Source</p>
                      <p className="text-sm text-gray-800">
                        {formatSource(selectedLead.source)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Information */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Lead Information
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Intent</p>
                    <p className="text-sm text-gray-800">
                      {selectedLead.chatbot_intent?.name || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">ZIP Code</p>
                    <p className="text-sm text-gray-800">
                      {selectedLead.zipCode || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-sm text-gray-800">
                      {formatDate(selectedLead.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="text-sm text-gray-800">
                      {formatDate(selectedLead.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Actions
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {selectedLead.phoneNumber && (
                    <button
                      onClick={() => handleCallClick(selectedLead.phoneNumber)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      <Phone size={16} />
                      Call
                    </button>
                  )}

                  {selectedLead.email && (
                    <button
                      onClick={() => handleEmailClick(selectedLead.email)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Mail size={16} />
                      Email
                    </button>
                  )}

                  {selectedLead.phoneNumber && (
                    <button
                      onClick={() => handleTextClick(selectedLead.phoneNumber)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <MessageSquare size={16} />
                      Text
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
