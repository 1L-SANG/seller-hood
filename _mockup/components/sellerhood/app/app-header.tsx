"use client";

import Link from "next/link";
import { User } from "lucide-react";

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-background/90 backdrop-blur-xl border-b border-border/50">
      <nav className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-semibold text-foreground">
            Seller<span className="text-primary">hood</span>
          </span>
        </Link>

        {/* User Avatar */}
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-background-secondary border border-border flex items-center justify-center hover:border-primary/30 transition-colors"
        >
          <User className="w-5 h-5 text-foreground-secondary" />
        </button>
      </nav>
    </header>
  );
}
