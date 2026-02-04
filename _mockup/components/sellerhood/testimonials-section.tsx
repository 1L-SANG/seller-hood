"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "김민지",
    role: "여성의류 쇼핑몰 운영",
    content: "촬영 비용이 월 200만원에서 20만원으로 줄었어요. 퀄리티는 오히려 더 좋아졌고요.",
    rating: 5,
  },
  {
    name: "박준혁",
    role: "스트릿 브랜드 대표",
    content: "신상품 출시 속도가 2배 빨라졌습니다. 이제 촬영 때문에 출시를 미루는 일이 없어요.",
    rating: 5,
  },
  {
    name: "이수연",
    role: "빈티지샵 운영",
    content: "바닥컷으로 대충 찍은 사진도 쇼핑몰 퀄리티로 바꿔주니까 정말 신세계예요.",
    rating: 5,
  },
  {
    name: "최현우",
    role: "남성복 셀러",
    content: "일관된 스타일의 상품 이미지 덕분에 브랜딩이 확실해졌어요. 재구매율이 올랐습니다.",
    rating: 5,
  },
  {
    name: "정다은",
    role: "키즈 의류 쇼핑몰",
    content: "아이 모델 촬영이 너무 힘들었는데, 이제는 옷만 찍으면 끝이에요!",
    rating: 5,
  },
  {
    name: "한승민",
    role: "스포츠웨어 셀러",
    content: "상품 이미지 퀄리티가 좋아지니까 문의도 줄고 반품도 줄었어요.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-background-secondary">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            셀러들의 <span className="text-primary">생생한 후기</span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-lg mx-auto">
            10,000명 이상의 셀러가 Sellerhood로 성공적인 결과를 만들고 있어요.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative p-8 bg-background rounded-2xl border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-foreground-muted">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10,000+", label: "활성 셀러" },
            { value: "500만+", label: "생성된 이미지" },
            { value: "4.9/5", label: "평균 만족도" },
            { value: "40%", label: "평균 전환율 상승" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-foreground-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
