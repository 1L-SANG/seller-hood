"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Step4Page() {
  return (
    <div className="min-h-screen bg-background-secondary py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= 4
                      ? "bg-gradient-to-br from-primary to-primary-light text-primary-foreground"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${step <= 4 ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-foreground-muted">Step 4 of 4</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            준비가 완료됐어요!
          </h1>
          <p className="text-foreground-secondary text-lg">
            이제 의류컷을 생성할 수 있어요
          </p>
        </div>

        {/* Input Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Reference Style Card */}
          <Card className="p-6 rounded-2xl bg-background border-l-4 border-l-primary">
            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-[3/4] rounded-lg bg-muted mb-4 flex items-center justify-center">
                <p className="text-foreground-muted text-sm">
                  레퍼런스 이미지
                </p>
              </div>
              <p className="text-sm font-medium text-foreground-secondary">
                이 느낌으로
              </p>
            </div>
          </Card>

          {/* Product Card */}
          <Card className="p-6 rounded-2xl bg-background border-l-4 border-l-border">
            <div className="flex flex-col items-center text-center">
              <div className="w-full aspect-[3/4] rounded-lg bg-muted mb-4 flex items-center justify-center">
                <p className="text-foreground-muted text-sm">상품 이미지</p>
              </div>
              <p className="text-sm font-medium text-foreground-secondary">
                이 옷을
              </p>
            </div>
          </Card>
        </div>

        {/* Visual Connector */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="text-foreground-muted">+</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
              <span className="text-primary font-bold">=</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center">
          <Button
            size="lg"
            className="w-full max-w-md h-16 text-lg bg-gradient-to-r from-primary to-primary-light hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
            asChild
          >
            <Link href="/create/generating">
              <Sparkles className="w-6 h-6" />
              이 스타일로 의류컷 만들기
            </Link>
          </Button>

          <p className="mt-4 text-sm text-foreground-muted">
            약 30초 정도 소요됩니다
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-start">
          <Button variant="ghost" asChild>
            <Link href="/create/step3">
              <ArrowLeft className="w-5 h-5" />
              이전
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
