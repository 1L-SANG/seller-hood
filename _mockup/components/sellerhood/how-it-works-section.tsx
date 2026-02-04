"use client";

import { Upload, ImageIcon, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "레퍼런스 업로드",
    description: "원하는 스타일의 쇼핑몰 이미지를 올려주세요",
  },
  {
    icon: ImageIcon,
    step: "02",
    title: "상품 업로드",
    description: "판매할 의류 이미지를 업로드해주세요",
  },
  {
    icon: Wand2,
    step: "03",
    title: "스타일 적용",
    description: "레퍼런스 스타일이 자동으로 적용됩니다",
  },
  {
    icon: Download,
    step: "04",
    title: "다운로드",
    description: "완성된 의류컷을 바로 사용하세요",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이렇게 <span className="text-primary">간단해요</span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-lg mx-auto">
            복잡한 과정 없이 4단계만으로 프로페셔널한 의류컷을 완성하세요.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
              )}
              
              <div className="text-center">
                {/* Icon */}
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/5 to-primary-light/10 flex items-center justify-center border border-primary/10">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground text-sm font-bold shadow-lg shadow-primary/30">
                    {step.step}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary-light/5 to-primary/5 rounded-3xl" />
          <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl border border-border p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Before */}
              <div className="text-center">
                <div className="aspect-[3/4] rounded-2xl bg-background-secondary border border-border flex items-center justify-center mb-4 overflow-hidden">
                  <div className="w-3/4 h-3/4 rounded-xl bg-muted flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-foreground-muted" />
                  </div>
                </div>
                <p className="text-foreground-secondary text-sm">내 상품 사진</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-xl shadow-primary/30">
                  <Wand2 className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>

              {/* After */}
              <div className="text-center">
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary/5 to-primary-light/10 border border-primary/20 flex items-center justify-center mb-4 overflow-hidden shadow-xl shadow-primary/10">
                  <div className="w-3/4 h-3/4 rounded-xl bg-background flex items-center justify-center border border-border">
                    <div className="text-center">
                      <div className="w-16 h-20 mx-auto mb-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary-light/20" />
                      <div className="text-xs text-primary font-medium">프로 퀄리티</div>
                    </div>
                  </div>
                </div>
                <p className="text-primary text-sm font-medium">완성된 의류컷</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
