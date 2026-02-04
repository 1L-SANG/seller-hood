"use client";

import type { AppStep } from "@/app/app/page";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: "reference", label: "레퍼런스" },
  { id: "confirm", label: "확인" },
  { id: "product", label: "상품" },
  { id: "generate", label: "생성" },
];

const stepOrder = ["reference", "confirm", "product", "generate"];

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="bg-background border-b border-border py-6">
      <div className="max-w-[600px] mx-auto px-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = step.id === currentStep;
            const isUpcoming = index > currentIndex;

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      isCompleted && "bg-gradient-to-br from-primary to-primary-light text-primary-foreground",
                      isCurrent && "bg-gradient-to-br from-primary to-primary-light text-primary-foreground ring-4 ring-primary/20",
                      isUpcoming && "bg-background border-2 border-border text-foreground-muted"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium transition-colors",
                      isCompleted && "text-primary",
                      isCurrent && "text-foreground",
                      isUpcoming && "text-foreground-muted"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 -mt-6">
                    <div
                      className={cn(
                        "h-[2px] transition-colors duration-300",
                        index < currentIndex
                          ? "bg-gradient-to-r from-primary to-primary-light"
                          : "bg-border"
                      )}
                      style={{
                        borderStyle: index >= currentIndex ? 'dashed' : 'solid',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
