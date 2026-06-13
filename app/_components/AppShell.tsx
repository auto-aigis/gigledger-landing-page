"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, IndianRupee, FileText, User, Settings, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/_lib/hooks";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Income", href: "/income", icon: IndianRupee },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Pricing", href: "/pricing", icon: Tag },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = async () => { await logout(); router.push("/login"); };

  if (!isMounted || loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );

  if (!user) { router.push("/login"); return null; }
  if (!user.onboarding_complete && pathname !== "/onboarding") { router.push("/onboarding"); return null; }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-60 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              <span className="text-lg font-bold text-gray-900">GigLedger</span>
            </div>
            {user.display_name && (
              <p className="text-xs text-gray-400 mt-2 truncate">{user.display_name}</p>
            )}
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}>
                    <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`} />
                    {label}
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-xs font-bold">
                  {(user.display_name || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{user.display_name || user.email}</p>
                <Badge variant="outline" className="text-xs border-gray-200 text-gray-500 capitalize px-1.5 py-0">{user.tier}</Badge>
              </div>
            </div>
            <Button onClick={handleLogout} className="w-full justify-start text-gray-500 hover:text-red-600" variant="ghost" size="sm">
              <LogOut className="mr-2 h-3.5 w-3.5" />Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="md:ml-60 w-full flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">₹</span>
            </div>
            <span className="text-base font-bold text-gray-900">GigLedger</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 p-1">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} />
            <nav className="absolute left-0 top-14 w-56 bg-white border-r border-gray-200 flex flex-col p-3 h-[calc(100vh-3.5rem)] overflow-y-auto shadow-xl">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                    <Icon className="h-4 w-4" />{label}
                  </div>
                </Link>
              ))}
              <div className="mt-auto pt-3 border-t border-gray-100">
                <Button onClick={handleLogout} className="w-full justify-start" variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />Logout
                </Button>
              </div>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
