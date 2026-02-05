"use client";

import Link from "next/link";
import { Download, RefreshCw, Sparkles, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ResultPage() {
  const handleDownload = () => {
    // TODO: 다운로드 로직
    console.log("Download image");
  };

  return (
    <div className="min-h-screen bg-background-secondary py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">의류컷이 완성됐어요</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            완성된 의류컷
          </h1>
        </div>

        {/* Result Image */}
        <Card className="p-6 md:p-10 rounded-2xl bg-background border border-border mb-8 animate-in fade-in zoom-in-95 duration-500 delay-200">
          <div className="max-w-2xl mx-auto">
            <div className="aspect-[3/4] rounded-xl bg-muted flex items-center justify-center shadow-2xl">
              <p className="text-foreground-muted">생성된 의류컷 이미지</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-250"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5" />
            다운로드
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/create/step4">
              <RefreshCw className="w-5 h-5" />
              다시 만들기
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="/create/step1">
              <Home className="w-5 h-5" />
              새 프로젝트 시작
            </Link>
          </Button>
        </div>

        {/* Info Card */}
        <Card className="p-6 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">
              💡 다음 단계
            </h3>
            <p className="text-sm text-foreground-secondary">
              다운로드한 이미지를 쇼핑몰 상세페이지에 바로 사용하실 수 있어요.
              <br />
              고품질 이미지로 전환율을 높여보세요!
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">30초</div>
            <div className="text-sm text-foreground-muted">생성 시간</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-foreground-muted">상업적 사용</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">고품질</div>
            <div className="text-sm text-foreground-muted">프리미엄 퀄리티</div>
          </div>
        </div>
      </div>
    </div>
  );
}
