"use client";

import Link from "next/link";
import { useState } from "react";
import { Upload, Image as ImageIcon, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Step1Page() {
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
                    step === 1
                      ? "bg-gradient-to-br from-primary to-primary-light text-primary-foreground"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${step === 1 ? "bg-primary/30" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-foreground-muted">Step 1 of 4</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            어떤 느낌의 컷을 만들고 싶으세요?
          </h1>
          <p className="text-foreground-secondary text-lg">
            참고하고 싶은 쇼핑몰 이미지를 업로드해주세요
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
              이런 분위기의 컷을 만들고 싶다면
              <br />
              여기에 올려주세요
            </h3>

            <p className="text-foreground-secondary mb-6">
              얼굴이 나오지 않는 의류 컷을 권장해요
            </p>

            <Button variant="outline" size="lg" className="mb-4">
              <ImageIcon className="w-5 h-5" />
              파일 선택
            </Button>

            <p className="text-sm text-foreground-muted">
              PNG, JPG • 최대 10MB
            </p>
          </div>
        </Card>

        {/* Guide Cards */}
        <div className="mt-12">
          <h4 className="text-center text-sm font-medium text-foreground-secondary mb-6">
            이런 이미지가 좋아요
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {["상체 컷", "전신 컷", "제품 컷"].map((type, i) => (
              <Card
                key={i}
                className="p-4 rounded-xl bg-background border border-border"
              >
                <div className="aspect-[3/4] rounded-lg bg-muted mb-3" />
                <p className="text-sm text-center text-foreground-secondary">
                  {type}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/">취소</Link>
          </Button>
          <Button
            size="lg"
            className="gap-2"
            disabled={!uploadedImage}
            asChild
          >
            <Link href="/create/step2">
              다음
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
