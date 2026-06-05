"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, BookOpen, FileText, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, protected: true },
    { name: "Subjects", href: "/subjects", icon: BookOpen, protected: false },
    { name: "Papers", href: "/papers", icon: FileText, protected: false },
    { name: "Profile", href: "/profile", icon: User, protected: true },
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || session);

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                WAEC Prep
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-1">
              {filteredLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "relative px-4 py-2 text-sm font-medium transition-colors rounded-full",
                      isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium text-white bg-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-2"
        >
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                pathname === link.href ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}
          {!session && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link
                href="/auth/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-center px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors pt-4"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}
