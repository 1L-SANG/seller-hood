"use client";

import { useState, useEffect } from "react";

interface GeneratingStateProps {
  onCancel: () => void;
}

const phases = [
  "스타일을 적용하고 있어요...",
  "조명을 조정하고 있어요...",
  "의류컷을 정리하고 있어요...",
  "거의 다 됐어요...",
];

export function GeneratingState({ onCancel }: GeneratingStateProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 40);

    // Phase text rotation
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/3 via-background to-primary-light/3 -z-10" />

      {/* Animated Visual */}
      <div className="relative mb-12">
        {/* Outer Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="absolute w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 3.64} 364`}
              className="transition-all duration-100"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Inner Pulsing Circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20" />
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-primary-light/30 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Phase Text */}
      <div className="h-8 flex items-center justify-center">
        <p
          key={currentPhase}
          className="text-xl text-foreground animate-in fade-in duration-300"
        >
          {phases[currentPhase]}
        </p>
      </div>

      {/* Progress Percentage (Optional) */}
      <p className="text-foreground-muted text-sm mt-4">
        {progress}%
      </p>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className="mt-12 text-foreground-muted hover:text-foreground text-sm transition-colors"
      >
        취소
      </button>
    </div>
  );
}
