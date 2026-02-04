import { Palette, Shield, Clock, Star, TrendingUp, Zap } from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "원클릭 생성",
    description:
      "복잡한 설정 없이 클릭 한 번으로 프로페셔널한 의류컷을 완성하세요.",
  },
  {
    icon: Palette,
    title: "스타일 매칭",
    description: "레퍼런스 이미지의 촬영 스타일을 그대로 재현합니다.",
  },
  {
    icon: Clock,
    title: "30초 완성",
    description:
      "기존 촬영 대비 100배 빠른 속도로 상품 이미지를 제작할 수 있어요.",
  },
  {
    icon: Shield,
    title: "일관된 퀄리티",
    description: "어떤 상품이든 균일한 퀄리티의 결과물을 보장합니다.",
  },
  {
    icon: Star,
    title: "비용 절감",
    description: "스튜디오 촬영 비용의 1/10로 같은 품질의 이미지를 얻으세요.",
  },
  {
    icon: TrendingUp,
    title: "매출 상승",
    description: "고품질 이미지로 상품 전환율을 평균 40% 향상시킵니다.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-background-secondary">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            왜 <span className="text-primary">각자</span>인가요?
          </h2>
          <p className="text-foreground-secondary text-lg max-w-lg mx-auto">
            복잡한 촬영 과정 없이, 누구나 쉽게 프로페셔널한 상품 이미지를 만들 수
            있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group p-8 bg-background rounded-2xl border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground-secondary leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

