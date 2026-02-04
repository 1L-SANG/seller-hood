"use client";

import { useState } from "react";
import type { ImageData } from "@/app/app/page";
import { Download, RefreshCw, Plus, Sparkles, Check } from "lucide-react";

interface ResultScreenProps {
  resultImage: string;
  referenceImage: ImageData;
  onRegenerate: () => void;
  onNewProject: () => void;
}

export function ResultScreen({
  resultImage,
  referenceImage,
  onRegenerate,
  onNewProject,
}: ResultScreenProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    // Create a download link
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `sellerhood-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          의류컷이 완성됐어요
        </h1>
      </div>

      {/* Result Image */}
      <div className="relative max-w-[600px] mx-auto mb-8">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10 bg-background-secondary animate-in zoom-in-95 duration-400">
          <img
            src={resultImage || "/placeholder.svg"}
            alt="Result"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Reference Thumbnail */}
        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-lg overflow-hidden border-2 border-background shadow-lg">
          <img
            src={referenceImage.preview || "/placeholder.svg"}
            alt="Reference"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-[400px] mx-auto space-y-3">
        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-250"
        >
          {isDownloaded ? (
            <>
              <Check className="w-5 h-5" />
              다운로드 완료!
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              다운로드
            </>
          )}
        </button>

        {/* Regenerate Button */}
        <button
          type="button"
          onClick={onRegenerate}
          className="w-full py-4 bg-transparent border border-border text-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:border-foreground-muted transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          다시 만들기
        </button>

        {/* New Project Link */}
        <button
          type="button"
          onClick={onNewProject}
          className="w-full py-3 flex items-center justify-center gap-2 text-foreground-secondary hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 프로젝트 시작
        </button>
      </div>

      {/* Completion Message */}
      <div className="max-w-[400px] mx-auto mt-12 p-6 bg-background-secondary rounded-2xl border border-border text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
          <Check className="w-6 h-6 text-success" />
        </div>
        <p className="text-foreground font-medium mb-2">
          다운로드가 완료됐어요!
        </p>
        <p className="text-foreground-secondary text-sm">
          상세페이지에 바로 사용해보세요
        </p>
      </div>
    </div>
  );
}
