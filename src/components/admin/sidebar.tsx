"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, ShieldUser, Layers, BookOpen, FileText, 
  CreditCard, BarChart3, ShieldAlert, Settings 
} from "lucide-react";
import { clsx } from "clsx";

const menuItems = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Users", href: "/super-admin/users", icon: Users },
  { name: "Admins", href: "/super-admin/admins", icon: ShieldUser },
  { name: "Faculties", href: "/super-admin/faculties", icon: Layers },
  { name: "Subjects", href: "/super-admin/subjects", icon: BookOpen },
  { name: "Papers", href: "/super-admin/papers", icon: FileText },
  { name: "Subscriptions", href: "/super-admin/subscriptions", icon: CreditCard },
  { name: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { name: "Audit Logs", href: "/super-admin/logs", icon: ShieldAlert },
  { name: "Settings", href: "/super-admin/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white min-h-screen p-6 transition-transform duration-300 md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <h1 className="text-xl font-black mb-10 tracking-tighter text-indigo-400">SUPER ADMIN</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                pathname === item.href 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
