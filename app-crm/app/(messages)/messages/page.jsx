"use client";

import React, { useMemo, useState } from "react";
import {
  MessageSquare,
  Smartphone,
  FileText,
  Mail,
  Phone,
  Search,
  X,
  User,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useWebsite } from "../../context/website/context";
import { useEffect } from "react";

const filters = [
  {
    key: "all",
    label: "All",
    icon: MessageSquare,
  },
  {
    key: "website_chat",
    label: "Website Chat",
    icon: Sparkles,
  },
  {
    key: "sms",
    label: "SMS",
    icon: Smartphone,
  },
  {
    key: "form",
    label: "Forms",
    icon: FileText,
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
  },
];

const stageStyles = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
  qualified: "bg-purple-50 text-purple-700 border-purple-200",
  converted: "bg-green-50 text-green-700 border-green-200",
  lost: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatStage = (stage) => {
  if (!stage) return "New";

  return stage
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPhone = (phone) => {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
};

/*
 * Try to extract a name from the conversation when there is
 * no associated Lead record yet.
 *
 * This is only a fallback for display purposes.
 * It does NOT modify the lead.
 */
const extractNameFromConversation = (messages = []) => {
  const namePatterns = [
    /my name is ([a-zA-Z][a-zA-Z '-]{1,40})/i,
    /name is ([a-zA-Z][a-zA-Z '-]{1,40})/i,
    /i'm ([a-zA-Z][a-zA-Z '-]{1,40})/i,
    /i am ([a-zA-Z][a-zA-Z '-]{1,40})/i,
  ];

  for (const message of messages) {
    if (message.role !== "user" || !message.content) continue;

    for (const pattern of namePatterns) {
      const match = message.content.match(pattern);

      if (match?.[1]) {
        return match[1].trim();
      }
    }
  }

  return null;
};

const getFirstUserMessage = (messages = []) => {
  const firstUserMessage = messages.find(
    (message) => message.role === "user" && typeof message.content === "string",
  );

  return firstUserMessage?.content || "No message available.";
};

const getLastMessage = (messages = []) => {
  if (!messages.length) return null;

  return messages[messages.length - 1];
};

const getTypeLabel = (type) => {
  switch (type) {
    case "website_chat":
      return "Website Chat";
    case "sms":
      return "SMS";
    case "form":
      return "Form Submission";
    case "email":
      return "Email";
    default:
      return "Message";
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case "website_chat":
      return Sparkles;
    case "sms":
      return Smartphone;
    case "form":
      return FileText;
    case "email":
      return Mail;
    default:
      return MessageSquare;
  }
};

const getTypeStyles = (type) => {
  switch (type) {
    case "website_chat":
      return "bg-purple-50 text-purple-700";

    case "sms":
      return "bg-green-50 text-green-700";

    case "form":
      return "bg-orange-50 text-orange-700";

    case "email":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-gray-50 text-gray-700";
  }
};

export default function MessagesPage({ onViewLead, onChangeStage }) {
  const { getWebsiteData } = useWebsite();
  const [websiteData, setWebsiteData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [chatbotConversations, setChatbotConversations] = useState([]);
  const [formSubmissions, setFormSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWebsiteData();

        console.log("Website Data:", res);

        setWebsiteData(res.data.websiteData);
        setFormSubmissions(res.data.websiteData.data[0].form_submissions || []);
        setLeads(res.data.leadsData);
        setChatbotConversations(res.data.chatbotConversationsData.data);
      } catch (error) {
        console.error("Error fetching website data:", error);
      }
    };

    fetchData();
  }, []);

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  /*
   * Convert your chatbotConversations into the unified
   * Messages format used by this page.
   *
   * For now the only source is website_chat.
   *
   * Later we can add:
   * - SMS conversations
   * - Form submissions
   * - Emails
   */

  const websiteMessages = useMemo(() => {
    return chatbotConversations?.map((conversation) => {
      /*
       * Prefer the populated lead directly from the conversation.
       */
      let lead = conversation.lead;

      /*
       * If the conversation does not have a populated lead,
       * try finding it in the leads array by sessionId.
       */
      if (!lead && conversation.sessionId) {
        lead = leads.find((item) => item.sessionId === conversation.sessionId);
      }

      /*
       * Conversations can exist without a Lead.
       *
       * For example, your data currently has conversations where
       * lead === null.
       */
      const fallbackName = extractNameFromConversation(conversation.messages);

      const displayName = lead?.name || fallbackName || "Website Visitor";

      const messages = Array.isArray(conversation.messages)
        ? conversation.messages
        : [];

      const lastMessage = getLastMessage(messages);

      return {
        id: conversation.documentId || conversation.id,
        type: "website_chat",
        conversation,
        lead,
        displayName,
        intent: lead?.chatbot_intent?.name || null,
        preview: lastMessage?.content || getFirstUserMessage(messages),
        timestamp:
          lastMessage?.timestamp ||
          conversation.updatedAt ||
          conversation.createdAt,
        messages,
        unread: lead ? !lead.seenAt : false,
      };
    });
  }, [chatbotConversations, leads]);

  const formMessages = useMemo(() => {
    return formSubmissions?.map((submission) => {
      const data = submission.data || {};

      const fullName = [data.firstName, data.lastName]
        .filter(Boolean)
        .join(" ");

      return {
        id: submission.documentId || submission.id,
        type: "form",
        displayName: fullName || "Website Form Submission",
        preview: data.message || "New form submission",
        timestamp: submission.createdAt || submission.updatedAt,
        unread: !submission.seenAt,

        lead: {
          name: fullName,
          email: data.email || null,
          phoneNumber: data.phone || null,
          stage: "new",
        },

        submission,
        messages: [
          {
            id: submission.documentId,
            role: "user",
            content: data.message || "No message provided.",
            timestamp: submission.createdAt,
          },
        ],
      };
    });
  }, [formSubmissions]);

  /*
   * This is intentionally structured so SMS, Forms, and Email
   * can be added later without changing the UI.
   */

  console.log("Form Messages:", formMessages);
  console.log("Form Submissions:", formSubmissions);
  console.log("Website Data:", websiteData);
  const allMessages = useMemo(() => {
    return [
      ...websiteMessages,
      ...formMessages,

      // Future:
      // ...smsMessages,
      // ...emailMessages,
    ];
  }, [websiteMessages]);

  const filteredMessages = useMemo(() => {
    return allMessages.filter((message) => {
      const matchesFilter =
        activeFilter === "all" || message.type === activeFilter;

      const searchValue = search.toLowerCase().trim();
      const matchesSearch =
        !searchValue ||
        message.displayName?.toLowerCase().includes(searchValue) ||
        message.lead?.email?.toLowerCase().includes(searchValue) ||
        message.lead?.phoneNumber?.toLowerCase().includes(searchValue) ||
        message.preview?.toLowerCase().includes(searchValue) ||
        message.intent?.toLowerCase().includes(searchValue);
      return matchesFilter && matchesSearch;
    });
  }, [allMessages, activeFilter, search]);

  const unreadCount = allMessages.filter((message) => message.unread).length;

  const getFilterCount = (filterKey) => {
    if (filterKey === "all") {
      return allMessages.length;
    }
    return allMessages.filter((message) => message.type === filterKey).length;
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const handleCall = (lead) => {
    if (!lead?.phoneNumber) return;

    window.location.href = `tel:${lead.phoneNumber}`;
  };

  const handleText = (lead) => {
    if (!lead?.phoneNumber) return;

    window.location.href = `sms:${lead.phoneNumber}`;
  };

  const handleEmail = (lead) => {
    if (!lead?.email) return;

    window.location.href = `mailto:${lead.email}`;
  };

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-0 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
      {/* =====================================================
        LEFT SIDE — MESSAGE LIST
    ====================================================== */}

      <div
        className={`flex min-w-0 flex-1 flex-col min-h-0 ${
          selectedMessage ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* LEFT HEADER — STICKY */}
        <div className="shrink-0 border-b border-gray-200 bg-white">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">Messages</h1>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Manage conversations and customer inquiries from your website,
                  SMS, and forms.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* FILTERS — ALSO STAYS FIXED */}
          <div className="border-t border-gray-200 px-4 sm:px-6">
            <div className="flex gap-1 overflow-x-auto">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const active = activeFilter === filter.key;
                const count = getFilterCount(filter.key);

                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    {filter.label}

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LEFT CONTENT — SCROLLS */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-5xl space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                  <MessageSquare className="h-7 w-7 text-gray-400" />
                </div>

                <h3 className="text-sm font-semibold text-gray-900">
                  No messages found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  {activeFilter === "all"
                    ? "Messages and conversations will appear here."
                    : `There are no ${filters
                        .find((filter) => filter.key === activeFilter)
                        ?.label.toLowerCase()} yet.`}
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => {
                const TypeIcon = getTypeIcon(message.type);

                return (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`group w-full rounded-2xl border bg-white p-4 text-left transition hover:border-blue-200 hover:shadow-sm ${
                      message.unread
                        ? "border-blue-200 bg-blue-50/30"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getTypeStyles(
                          message.type,
                        )}`}
                      >
                        <TypeIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-center gap-2">
                            {message.unread && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                            )}

                            <h3 className="truncate font-semibold text-gray-900">
                              {message.displayName}
                            </h3>

                            <span
                              className={`hidden rounded-md px-2 py-0.5 text-[11px] font-medium sm:inline-flex ${getTypeStyles(
                                message.type,
                              )}`}
                            >
                              {getTypeLabel(message.type)}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>

                        {message.intent && (
                          <div className="mt-1">
                            <span className="text-xs font-medium text-purple-600">
                              {message.intent}
                            </span>
                          </div>
                        )}

                        {message.lead && (
                          <div className="mt-1">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                                stageStyles[message.lead.stage] ||
                                stageStyles.new
                              }`}
                            >
                              {formatStage(message.lead.stage)}
                            </span>
                          </div>
                        )}

                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {message.preview}
                        </p>
                      </div>

                      <ArrowRight className="mt-3 hidden h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500 sm:block" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
        RIGHT SIDE — DETAIL PANEL
    ====================================================== */}

      {selectedMessage && (
        <div className="flex h-full w-full min-h-0 flex-col bg-white lg:w-[480px] lg:border-l lg:border-gray-200">
          {/* RIGHT HEADER — STICKY */}
          <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-semibold text-gray-900">
                    {selectedMessage.displayName}
                  </h2>

                  {selectedMessage.unread && (
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>

                <p className="mt-0.5 text-xs text-gray-500">
                  {getTypeLabel(selectedMessage.type)} ·{" "}
                  {formatDate(selectedMessage.timestamp)}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* RIGHT LEAD INFO — STAYS FIXED */}
          <div className="shrink-0 border-b border-gray-200 p-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {selectedMessage.displayName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {selectedMessage.lead?.email || "No email available"}
                    </p>
                  </div>
                </div>

                {selectedMessage.lead && (
                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${
                      stageStyles[selectedMessage.lead.stage] || stageStyles.new
                    }`}
                  >
                    {formatStage(selectedMessage.lead.stage)}
                  </span>
                )}
              </div>

              {selectedMessage.lead?.phoneNumber && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {formatPhone(selectedMessage.lead.phoneNumber)}
                </div>
              )}

              {selectedMessage.lead?.address && (
                <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                  <span>
                    {typeof selectedMessage.lead.address === "string"
                      ? selectedMessage.lead.address
                      : [
                          selectedMessage.lead.address.line1,
                          selectedMessage.lead.address.line2,
                          selectedMessage.lead.address.city,
                          selectedMessage.lead.address.state,
                          selectedMessage.lead.address.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                  </span>
                </div>
              )}

              {!selectedMessage.lead?.address &&
                selectedMessage.lead?.zipCode && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    ZIP {selectedMessage.lead.zipCode}
                  </div>
                )}
            </div>

            {selectedMessage.lead && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCall(selectedMessage.lead)}
                  disabled={!selectedMessage.lead.phoneNumber}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </button>

                <button
                  onClick={() => handleText(selectedMessage.lead)}
                  disabled={!selectedMessage.lead.phoneNumber}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Smartphone className="h-4 w-4" />
                  Text
                </button>

                <button
                  onClick={() => handleEmail(selectedMessage.lead)}
                  disabled={!selectedMessage.lead.email}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              </div>
            )}

            {selectedMessage.lead && onViewLead && (
              <button
                onClick={() => onViewLead(selectedMessage.lead)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                View Lead
              </button>
            )}
          </div>

          {/* RIGHT CONVERSATION — SCROLLS */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Website Conversation
                </h3>

                {selectedMessage.intent && (
                  <p className="text-xs text-gray-500">
                    {selectedMessage.intent}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {selectedMessage.messages?.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id || `${message.timestamp}-${index}`}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] flex-col ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          isUser
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.timestamp && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {(!selectedMessage.messages ||
                selectedMessage.messages.length === 0) && (
                <div className="py-10 text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />

                  <p className="mt-2 text-sm text-gray-500">
                    No conversation history available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM CONTROLS — STAYS FIXED */}
          {selectedMessage.lead && (
            <div className="shrink-0 border-t border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Lead Stage
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-gray-900">
                    {formatStage(selectedMessage.lead.stage)}
                  </p>
                </div>

                {onChangeStage && (
                  <button
                    onClick={() => onChangeStage(selectedMessage.lead)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Change Stage
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
