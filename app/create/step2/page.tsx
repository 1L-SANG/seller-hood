"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Step2Page() {
  return (
    <div className="min-h-screen bg-background-secondary py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= 2
                      ? "bg-gradient-to-br from-primary to-primary-light text-primary-foreground"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {step === 1 ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${step <= 2 ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-foreground-muted">Step 2 of 4</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            스타일 확인
          </h1>
          <p className="text-foreground-secondary text-lg">
            이 레퍼런스의 촬영 스타일을 기준으로 의류컷이 생성됩니다
          </p>
        </div>

        {/* Reference Preview */}
        <Card className="p-8 rounded-2xl bg-background border border-border">
          <div className="flex flex-col items-center">
            {/* Image Placeholder */}
            <div className="w-full max-w-sm aspect-[3/4] rounded-xl bg-muted mb-6 flex items-center justify-center">
              <p className="text-foreground-muted">레퍼런스 이미지</p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full mb-6">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">스타일 분석 완료</span>
            </div>

            {/* Style Info - 매우 간단하게 */}
            <div className="w-full max-w-md">
              <p className="text-center text-foreground-secondary text-sm mb-6">
                선택된 스타일
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-background-secondary rounded-full text-sm text-foreground-secondary">
                  내추럴 톤
                </div>
                <div className="px-4 py-2 bg-background-secondary rounded-full text-sm text-foreground-secondary">
                  정면 컷
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/create/step1">
              <ArrowLeft className="w-5 h-5" />
              이전
            </Link>
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/create/step1">다른 이미지 선택</Link>
            </Button>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/create/step3">
                좋아요, 다음으로
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
