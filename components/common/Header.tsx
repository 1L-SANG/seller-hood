"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // PRD.md "랜딩 페이지 > 네비게이션 바" 메뉴 구성 반영
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "기능 소개", href: "/#features" },
      { label: "요금제", href: "/#pricing" },
      { label: "고객 지원", href: "/#" },
      { label: "블로그", href: "/#" },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent",
      )}
    >
      <nav className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label="각자 홈으로 이동"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              각
            </span>
          </div>
          <span className="text-xl font-semibold text-foreground">
            각<span className="text-primary">자</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground-secondary hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-foreground-secondary hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-full font-medium text-sm hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            무료로 시작하기
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={handleToggleMobileMenu}
          className="md:hidden p-2 text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-gnb"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-gnb"
          className="md:hidden absolute top-[72px] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleCloseMobileMenu}
                className="py-2 text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              <Link
                href="/login"
                onClick={handleCloseMobileMenu}
                className="py-2 text-center text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                onClick={handleCloseMobileMenu}
                className="py-3 text-center bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

