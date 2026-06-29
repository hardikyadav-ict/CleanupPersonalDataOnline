"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  User,
  FileSignature,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Data Brokers", href: "/dashboard/brokers", icon: Shield },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Authorization", href: "/dashboard/authorization", icon: FileSignature },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-emerald-600" />
              <span className="font-bold text-gray-900">PrivacyShield</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            <hr className="my-4 border-gray-100" />

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5" />
              Back to website
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-emerald-700">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between h-16 px-4">
              <button onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-gray-900">PrivacyShield</span>
              </Link>
              <div className="w-6" />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
