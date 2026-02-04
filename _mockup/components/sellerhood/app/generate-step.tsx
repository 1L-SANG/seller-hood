"use client";

import type { ImageData } from "@/app/app/page";
import { ArrowLeft, Plus, Equal, Wand2 } from "lucide-react";

interface GenerateStepProps {
  referenceImage: ImageData;
  productImage: ImageData;
  onGenerate: () => void;
  onBack: () => void;
}

export function GenerateStep({
  referenceImage,
  productImage,
  onGenerate,
  onBack,
}: GenerateStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Preview Cards */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
        {/* Reference Card */}
        <div className="w-full sm:w-[180px]">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border-l-4 border-l-primary shadow-lg">
            <img
              src={referenceImage.preview || "/placeholder.svg"}
              alt="Reference"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-foreground-secondary text-sm mt-3">
            이 느낌으로
          </p>
        </div>

        {/* Plus Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-background-secondary border border-border flex items-center justify-center">
            <Plus className="w-5 h-5 text-foreground-muted" />
          </div>
        </div>

        {/* Product Card */}
        <div className="w-full sm:w-[180px]">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border-l-4 border-l-foreground-muted shadow-lg">
            <img
              src={productImage.preview || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-foreground-secondary text-sm mt-3">
            이 옷을
          </p>
        </div>
      </div>

      {/* Equal Sign */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 border border-primary/20 flex items-center justify-center">
          <Equal className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Generate Button */}
      <div className="max-w-[400px] mx-auto">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-5 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.99] transition-all duration-250 group"
        >
          <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          이 스타일로 의류컷 만들기
        </button>
        <p className="text-center text-foreground-muted text-sm mt-4">
          약 30초 정도 소요됩니다
        </p>
      </div>

      {/* Back Button */}
      <div className="max-w-[400px] mx-auto mt-8">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 flex items-center justify-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          이전 단계로
        </button>
      </div>
    </div>
  );
}
