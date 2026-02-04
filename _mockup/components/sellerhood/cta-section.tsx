"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-primary/5 via-background to-primary-light/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="relative bg-gradient-to-r from-primary to-primary-light rounded-3xl p-12 md:p-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}
            />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-white/10 blur-3xl" />

          <div className="relative text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
              지금 바로 시작하세요
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-lg mx-auto mb-10 text-balance">
              무료로 10장의 의류컷을 만들어보세요.
              <br />
              신용카드 없이 바로 시작할 수 있어요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-full font-semibold text-base hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-250"
              >
                <Sparkles className="w-5 h-5" />
                무료로 시작하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-primary-foreground border border-primary-foreground/30 rounded-full font-medium text-base hover:bg-primary-foreground/10 transition-all duration-250"
              >
                데모 보기
              </Link>
            </div>

            <p className="mt-8 text-primary-foreground/60 text-sm">
              가입 후 바로 사용 가능 • 신용카드 불필요
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
