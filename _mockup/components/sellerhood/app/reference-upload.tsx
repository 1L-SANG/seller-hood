"use client";

import React from "react"

import { useState, useCallback, useRef } from "react";
import type { ImageData } from "@/app/app/page";
import { Upload, Check, ArrowRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferenceUploadProps {
  imageData: ImageData;
  onUpload: (file: File, preview: string) => void;
  onNext: () => void;
}

export function ReferenceUpload({
  imageData,
  onUpload,
  onNext,
}: ReferenceUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(!!imageData.preview);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onUpload(file, preview);
        setIsAnalyzing(true);
        // Simulate analysis
        setTimeout(() => {
          setIsAnalyzing(false);
          setIsAnalyzed(true);
        }, 2000);
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
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          어떤 느낌의 컷을 만들고 싶으세요?
        </h1>
        <p className="text-foreground-secondary">
          참고하고 싶은 쇼핑몰 이미지를 업로드해주세요
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={cn(
          "relative max-w-[560px] mx-auto rounded-2xl border-2 border-dashed transition-all duration-250 overflow-hidden",
          !imageData.preview && "p-12",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : imageData.preview
            ? "border-transparent"
            : "border-border bg-background-secondary hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {imageData.preview ? (
          // Image Preview
          <div className="relative aspect-[4/5]">
            <img
              src={imageData.preview || "/placeholder.svg"}
              alt="Reference"
              className="w-full h-full object-cover rounded-xl"
            />
            
            {/* Overlay for analyzing/analyzed state */}
            {(isAnalyzing || isAnalyzed) && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-background">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">스타일 분석 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-background">
                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-3 h-3 text-success-foreground" />
                    </div>
                    <span className="text-sm font-medium">분석 완료</span>
                  </div>
                )}
              </div>
            )}

            {/* Success badge */}
            {isAnalyzed && !isAnalyzing && (
              <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success text-success-foreground text-sm font-medium rounded-full">
                  <Check className="w-4 h-4" />
                  분석 완료
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload Prompt
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary-light/10 mb-6">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg text-foreground mb-1">
              이런 분위기의 컷을 만들고 싶다면
            </p>
            <p className="text-lg text-foreground mb-4">
              여기에 올려주세요
            </p>
            <p className="text-sm text-foreground-muted mb-6">
              얼굴이 나오지 않는 의류 컷을 권장해요
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

      {/* Guide Cards */}
      {!imageData.preview && (
        <div className="max-w-[560px] mx-auto mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground-secondary">이런 이미지가 좋아요</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["상체 컷", "전신 컷", "제품 컷"].map((label) => (
              <div
                key={label}
                className="aspect-[3/4] rounded-xl bg-background-secondary border border-border flex flex-col items-center justify-center gap-2"
              >
                <ImageIcon className="w-8 h-8 text-foreground-muted" />
                <span className="text-xs text-foreground-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      {isAnalyzed && !isAnalyzing && (
        <div className="max-w-[560px] mx-auto mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-250"
          >
            다음
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
