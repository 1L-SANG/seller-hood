"use client";

import Link from "next/link";
import { useState } from "react";
import { Upload, Image as ImageIcon, ArrowRight, ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Step3Page() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // TODO: 파일 처리 로직
  };

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
                    step <= 3
                      ? "bg-gradient-to-br from-primary to-primary-light text-primary-foreground"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${step <= 3 ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-foreground-muted">Step 3 of 4</p>
          </div>
        </div>

        {/* Context Card */}
        <Card className="p-4 rounded-xl bg-background border border-primary/20 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-lg bg-muted flex items-center justify-center">
              <p className="text-xs text-foreground-muted">레퍼런스</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground-muted mb-1">
                선택된 스타일
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  내추럴 톤
                </Badge>
                <Badge variant="outline" className="text-xs">
                  정면 컷
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이제 내 상품을 올려주세요
          </h1>
          <p className="text-foreground-secondary text-lg">
            판매할 의류 이미지를 업로드해주세요
          </p>
        </div>

        {/* Upload Zone */}
        <Card
          className={`p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-background hover:border-primary/50 hover:bg-primary/3"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3">
              촬영 퀄리티가 낮아도 괜찮아요
              <br />
              옷만 잘 보이면 됩니다
            </h3>

            <p className="text-foreground-secondary mb-6">
              바닥컷, 마네킹컷, 행거컷 모두 OK
            </p>

            <Button variant="outline" size="lg" className="mb-6">
              <ImageIcon className="w-5 h-5" />
              파일 선택
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm">
                <Check className="w-4 h-4" />
                바닥컷 OK
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm">
                <Check className="w-4 h-4" />
                마네킹 OK
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm">
                <Check className="w-4 h-4" />
                대충 찍은 것도 OK
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/create/step2">
              <ArrowLeft className="w-5 h-5" />
              이전
            </Link>
          </Button>
          <Button
            size="lg"
            className="gap-2"
            disabled={!uploadedImage}
            asChild
          >
            <Link href="/create/step4">
              다음
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
