"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "스타일을 적용하고 있어요...",
  "조명을 조정하고 있어요...",
  "의류컷을 정리하고 있어요...",
  "거의 다 됐어요...",
];

export default function GeneratingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // 메시지 변경 (8초마다)
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 8000);

    // 30초 후 결과 페이지로 이동 (실제로는 API 응답 후 이동)
    const redirectTimeout = setTimeout(() => {
      router.push("/create/result");
    }, 30000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-light/5 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Animated Loader */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-ping absolute" />
            {/* Middle ring */}
            <div className="w-32 h-32 rounded-full border-4 border-primary/30 animate-pulse" />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {loadingMessages[messageIndex]}
          </h1>
          <p className="text-foreground-secondary">
            잠시만 기다려주세요. 고품질의 의류컷을 생성하고 있어요.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((messageIndex + 1) / loadingMessages.length) * 100}%`,
            }}
          />
        </div>

        {/* Cancel option */}
        <button
          type="button"
          className="mt-8 text-sm text-foreground-muted hover:text-foreground transition-colors"
          onClick={() => router.push("/create/step4")}
        >
          취소
        </button>
      </div>
    </div>
  );
}
