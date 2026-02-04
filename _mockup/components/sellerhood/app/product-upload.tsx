"use client";

import React from "react"

import { useState, useCallback, useRef } from "react";
import type { ImageData } from "@/app/app/page";
import { Upload, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductUploadProps {
  referenceImage: ImageData;
  productImage: ImageData;
  onUpload: (file: File, preview: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProductUpload({
  referenceImage,
  productImage,
  onUpload,
  onNext,
  onBack,
}: ProductUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(!!productImage.preview);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onUpload(file, preview);
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          setIsAnalyzed(true);
        }, 1500);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Context Card */}
      <div className="max-w-[560px] mx-auto mb-8">
        <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-xl border border-border">
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={referenceImage.preview || "/placeholder.svg"}
              alt="Reference"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-foreground-muted mb-1">선택된 스타일</p>
            <p className="text-sm text-foreground font-medium">
              내추럴 톤 • 정면 컷
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          이제 내 상품을 올려주세요
        </h1>
        <p className="text-foreground-secondary">
          판매할 의류 이미지를 업로드해주세요
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={cn(
          "relative max-w-[560px] mx-auto rounded-2xl border-2 border-dashed transition-all duration-250 overflow-hidden",
          !productImage.preview && "p-12",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : productImage.preview
            ? "border-transparent"
            : "border-border bg-background-secondary hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {productImage.preview ? (
          <div className="relative aspect-[4/5]">
            <img
              src={productImage.preview || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-cover rounded-xl"
            />
            
            {(isAnalyzing || isAnalyzed) && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-background">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">상품 정보 확인 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-background">
                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-3 h-3 text-success-foreground" />
                    </div>
                    <span className="text-sm font-medium">확인 완료</span>
                  </div>
                )}
              </div>
            )}

            {isAnalyzed && !isAnalyzing && (
              <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success text-success-foreground text-sm font-medium rounded-full">
                  <Check className="w-4 h-4" />
                  확인 완료
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary-light/10 mb-6">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg text-foreground mb-1">
              촬영 퀄리티가 낮아도 괜찮아요
            </p>
            <p className="text-lg text-foreground mb-4">
              옷만 잘 보이면 됩니다
            </p>
            <p className="text-sm text-foreground-muted mb-6">
              바닥컷, 마네킹컷, 행거컷 모두 OK
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 border border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              파일 선택
            </button>
            <p className="text-xs text-foreground-muted mt-4">
              PNG, JPG • 최대 10MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Reassurance Badges */}
      {!productImage.preview && (
        <div className="max-w-[560px] mx-auto mt-6 flex flex-wrap justify-center gap-2">
          {["바닥컷 OK", "마네킹 OK", "대충 찍은 것도 OK"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background-secondary border border-border rounded-full"
            >
              <Check className="w-3.5 h-3.5 text-success" />
              <span className="text-sm text-foreground-secondary">{badge}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="max-w-[560px] mx-auto mt-8">
        {isAnalyzed && !isAnalyzing ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              type="button"
              onClick={onNext}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-250"
            >
              다음
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 flex items-center justify-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 단계로
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 flex items-center justify-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            이전 단계로
          </button>
        )}
      </div>
    </div>
  );
}
