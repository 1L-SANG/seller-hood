"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "스타터",
    description: "개인 셀러를 위한 기본 플랜",
    price: "무료",
    period: "",
    features: [
      "월 10회 생성",
      "기본 해상도",
      "이메일 지원",
      "워터마크 포함",
    ],
    cta: "무료로 시작하기",
    popular: false,
  },
  {
    name: "프로",
    description: "성장하는 쇼핑몰을 위한 플랜",
    price: "49,000",
    period: "/월",
    features: [
      "월 100회 생성",
      "고해상도 출력",
      "우선 지원",
      "워터마크 제거",
      "배치 업로드",
      "스타일 저장",
    ],
    cta: "프로 시작하기",
    popular: true,
  },
  {
    name: "엔터프라이즈",
    description: "대규모 운영을 위한 맞춤 플랜",
    price: "문의",
    period: "",
    features: [
      "무제한 생성",
      "최고 해상도",
      "전담 매니저",
      "API 연동",
      "맞춤 트레이닝",
      "SLA 보장",
    ],
    cta: "문의하기",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-background">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            합리적인 <span className="text-primary">요금제</span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-lg mx-auto">
            스튜디오 촬영 비용의 1/10로 같은 퀄리티의 이미지를 만들어보세요.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-primary/5 to-background border-primary/30 shadow-xl shadow-primary/10 scale-105"
                  : "bg-background border-border hover:border-primary/20 hover:shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-light text-primary-foreground text-sm font-medium rounded-full shadow-lg shadow-primary/30">
                    <Sparkles className="w-4 h-4" />
                    인기 플랜
                  </div>
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-foreground-secondary text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-foreground-muted">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? "bg-primary" : "bg-primary/10"
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <span className="text-foreground-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/app"
                className={`block w-full py-3.5 text-center rounded-xl font-medium transition-all duration-250 ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                    : "bg-background border border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Hint */}
        <p className="text-center text-foreground-muted mt-12">
          모든 플랜에 14일 무료 체험이 포함됩니다.{" "}
          <Link href="#" className="text-primary hover:underline">
            자주 묻는 질문 보기
          </Link>
        </p>
      </div>
    </section>
  );
}
