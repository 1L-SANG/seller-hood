"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-semibold text-foreground">
            Seller<span className="text-primary">hood</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
          >
            기능 소개
          </Link>
          <Link
            href="#pricing"
            className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
          >
            요금제
          </Link>
          <Link
            href="#"
            className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
          >
            고객 지원
          </Link>
          <Link
            href="#"
            className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
          >
            블로그
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-foreground-secondary hover:text-foreground transition-colors duration-200"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-full font-medium text-sm hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-250"
          >
            회원가입
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground-secondary hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-foreground-secondary hover:text-foreground transition-colors"
            >
              기능 소개
            </Link>
            <Link
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-foreground-secondary hover:text-foreground transition-colors"
            >
              요금제
            </Link>
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-foreground-secondary hover:text-foreground transition-colors"
            >
              고객 지원
            </Link>
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-foreground-secondary hover:text-foreground transition-colors"
            >
              블로그
            </Link>
            <div className="pt-4 border-t border-border flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-center text-foreground-secondary hover:text-foreground transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-center bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-full font-medium"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
