"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";

/* ---------------- Notifications ---------------- */

export function NotificationsDropdown({ onClose }) {
  const notifications = [
    {
      id: 1,
      title: "New lead received",
      description: "John Smith submitted a contact form.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Website update completed",
      description: "Your website changes are now live.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Monthly report available",
      description: "Your July CRM report is ready.",
      time: "Yesterday",
      unread: false,
    },
  ];

  return (
    <div className="absolute right-0 top-14 w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            You have 2 unread notifications
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      {/* Notifications */}
      <div className="max-h-[360px] overflow-y-auto">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            className="flex w-full gap-3 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50"
          >
            {/* Status */}
            <div className="mt-1.5 flex-shrink-0">
              {notification.unread ? (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>

                <span className="whitespace-nowrap text-[11px] text-gray-400">
                  {notification.time}
                </span>
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {notification.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <button className="text-xs font-medium text-gray-500 hover:text-gray-900">
          Mark all as read
        </button>

        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */

export function SettingsDropdown({ onClose }) {
  return (
    <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
      <div className="px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Settings
        </p>
      </div>

      <DropdownLink
        href="/settings"
        icon={Settings}
        title="General Settings"
        description="Manage your CRM"
        onClick={onClose}
      />

      <DropdownLink
        href="/settings/billing"
        icon={CreditCard}
        title="Billing"
        description="Plans and payments"
        onClick={onClose}
      />

      <DropdownLink
        href="/help"
        icon={HelpCircle}
        title="Help & Support"
        description="Get help with CenifyIT"
        onClick={onClose}
      />
    </div>
  );
}

/* ---------------- Client Menu ---------------- */

export function ClientDropdown({ client, onClose, onLogout }) {
  const firstName = client?.firstName || "User";
  const lastName = client?.lastName || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0) || ""}`.toUpperCase();

  return (
    <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* User information */}
      <div className="border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {firstName} {lastName}
            </p>

            {client?.email && (
              <p className="truncate text-xs text-gray-500">{client.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-2">
        {/* <DropdownLink
          href="/profile"
          icon={User}
          title="My Profile"
          description="View your profile"
          onClick={onClose}
        /> */}

        <DropdownLink
          href="/settings"
          icon={Settings}
          title="Account Settings"
          description="Manage your account"
          onClick={onClose}
        />

        <DropdownLink
          href="/settings/billing"
          icon={CreditCard}
          title="Billing"
          description="Manage your subscription"
          onClick={onClose}
        />
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 p-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
            <LogOut size={17} />
          </div>

          <div>
            <p className="text-sm font-medium text-red-600">Sign out</p>
            <p className="text-xs text-gray-400">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Shared Link ---------------- */

function DropdownLink({ href, icon: Icon, title, description, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-400">{description}</p>
      </div>
    </Link>
  );
}
