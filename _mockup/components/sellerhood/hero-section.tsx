"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary-light/3" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Images - Desktop Only */}
      <div className="hidden lg:block">
        {/* Top Left - Fashion Lookbook */}
        <div className="absolute top-32 left-8 xl:left-16 w-48 h-64 rounded-2xl bg-background-secondary shadow-lg -rotate-6 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="w-full h-full bg-gradient-to-br from-background-secondary to-background-tertiary flex flex-col p-4">
            <div className="text-xs text-foreground-muted mb-2">Review</div>
            <div className="flex-1 rounded-lg bg-background-tertiary" />
            <div className="mt-3 space-y-1">
              <div className="h-2 w-3/4 rounded bg-border" />
              <div className="h-2 w-1/2 rounded bg-border" />
            </div>
          </div>
        </div>

        {/* Left Middle - Model Hoodie */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 xl:left-24 w-44 h-56 rounded-2xl bg-background-secondary shadow-lg rotate-3 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          <div className="w-full h-full bg-gradient-to-br from-muted to-background-tertiary flex items-center justify-center">
            <div className="w-24 h-32 rounded-xl bg-foreground/5" />
          </div>
        </div>

        {/* Bottom Left - Laptop */}
        <div className="absolute bottom-32 left-12 xl:left-20 w-52 h-36 rounded-xl bg-foreground/90 shadow-xl rotate-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="w-full h-full p-2">
            <div className="w-full h-full rounded bg-background-secondary flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1.5 p-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-6 h-8 rounded bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Right - Product Card */}
        <div className="absolute top-36 right-8 xl:right-20 w-52 h-32 rounded-xl bg-background shadow-lg rotate-6 border border-border overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="w-full h-full p-4 flex gap-3">
            <div className="w-20 h-full rounded-lg bg-muted" />
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="text-[10px] text-foreground-muted">CP00983</div>
              <div className="text-xs font-medium text-foreground">클래식 라이더 재킷</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-[8px] text-primary">✎</span>
                </div>
                <span className="text-[10px] text-foreground-muted">Edit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Middle - Model Shot */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 xl:right-16 w-40 h-52 rounded-2xl bg-background-secondary shadow-lg -rotate-3 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
          <div className="w-full h-full bg-gradient-to-br from-background-tertiary to-muted flex items-center justify-center">
            <div className="w-20 h-28 rounded-lg bg-foreground/5" />
          </div>
        </div>

        {/* Bottom Right - Accessory */}
        <div className="absolute bottom-36 right-16 xl:right-28 w-36 h-36 rounded-2xl bg-background shadow-lg -rotate-6 border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="w-full h-full bg-gradient-to-br from-background-secondary to-muted flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-foreground/5" />
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm text-foreground-secondary">10,000+ 셀러가 신뢰하는 서비스</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight mb-6">
            <span className="text-foreground">제품 사진만으로</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              원클릭 AI
            </span>
            <br />
            <span className="text-foreground">의류컷 자동생성</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-foreground-secondary max-w-[480px] mx-auto mb-10 leading-relaxed text-balance">
            레퍼런스 이미지 스타일 그대로,
            <br className="hidden sm:block" />
            촬영 없이 완성하세요.
          </p>

          {/* CTA Button */}
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-full font-semibold text-base hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1 active:scale-[0.98] transition-all duration-250"
          >
            <Sparkles className="w-5 h-5" />
            무료로 시작하기
          </Link>

          {/* Trust Indicator */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 border-2 border-background flex items-center justify-center"
                >
                  <span className="text-xs text-primary font-medium">{i}</span>
                </div>
              ))}
            </div>
            <span className="text-sm text-foreground-muted">
              오늘 <span className="text-primary font-semibold">127명</span>이 시작했어요
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-foreground-muted" />
        </div>
      </div>
    </section>
  );
}
