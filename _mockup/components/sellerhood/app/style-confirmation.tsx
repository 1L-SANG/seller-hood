"use client";

import type { ImageData } from "@/app/app/page";

interface StyleConfirmationProps {
  referenceImage: ImageData;
  onConfirm: () => void;
  onBack: () => void;
}

export function StyleConfirmation({
  referenceImage,
  onConfirm,
  onBack,
}: StyleConfirmationProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-[480px] mx-auto text-center">
        {/* Reference Image */}
        <div className="relative mb-8">
          <div className="w-[200px] h-[250px] mx-auto rounded-2xl overflow-hidden shadow-xl shadow-foreground/10">
            <img
              src={referenceImage.preview || "/placeholder.svg"}
              alt="Reference"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Confirmation Text */}
        <p className="text-xl text-foreground leading-relaxed mb-2">
          이 레퍼런스의 촬영 스타일을 기준으로
        </p>
        <p className="text-xl text-foreground leading-relaxed mb-10">
          의류컷이 생성됩니다
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-250"
          >
            좋아요, 다음으로
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 bg-transparent border border-border text-foreground-secondary rounded-xl font-medium hover:border-foreground-muted hover:text-foreground transition-colors"
          >
            다른 이미지 선택
          </button>
        </div>
      </div>
    </div>
  );
}
