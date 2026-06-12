"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_lib/hooks";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Income", href: "/income" },
  { label: "Invoices", href: "/invoices" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Pricing", href: "/pricing" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!isMounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!user.onboarding_complete && pathname !== "/onboarding") {
    router.push("/onboarding");
    return null;
  }


  return (
    <div className="flex h-screen bg-white">
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">₹ GigLedger</h1>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              className="w-full justify-start"
              variant="ghost"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="md:ml-64 w-full flex flex-col">
        <header className="md:hidden h-14 border-b border-gray-200 bg-white flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-900"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="ml-4 text-xl font-semibold text-gray-900">₹ GigLedger</div>
        </header>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <nav className="absolute left-0 top-14 w-48 bg-white border-r border-gray-200 flex flex-col space-y-2 p-4 h-[calc(100vh-3.5rem)] overflow-y-auto">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <Button
                  onClick={handleLogout}
                  className="w-full justify-start"
                  variant="ghost"
                  size="sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
