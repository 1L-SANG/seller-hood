import Link from "next/link";

const footerLinks = {
  product: {
    title: "제품",
    links: [
      { label: "기능", href: "/#features" },
      { label: "요금제", href: "/#pricing" },
      { label: "업데이트", href: "/#" },
      { label: "로드맵", href: "/#" },
    ],
  },
  company: {
    title: "회사",
    links: [
      { label: "소개", href: "/#" },
      { label: "블로그", href: "/#" },
      { label: "채용", href: "/#" },
      { label: "언론", href: "/#" },
    ],
  },
  resources: {
    title: "리소스",
    links: [
      { label: "도움말 센터", href: "/#" },
      { label: "가이드", href: "/#" },
      { label: "API 문서", href: "/#" },
      { label: "파트너", href: "/#" },
    ],
  },
  legal: {
    title: "법적 고지",
    links: [
      { label: "이용약관", href: "/#" },
      { label: "개인정보처리방침", href: "/#" },
      { label: "쿠키 정책", href: "/#" },
      { label: "라이선스", href: "/#" },
    ],
  },
} as const;

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  각
                </span>
              </div>
              <span className="text-xl font-semibold text-background">
                각<span className="text-primary-light">자</span>
              </span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              레퍼런스 스타일을 참고해,
              <br />
              촬영 없이 의류컷을 빠르게 완성하세요.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-background mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-background/60 hover:text-primary-light text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-md"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-sm">© 2026 각자.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/#"
              className="text-background/40 hover:text-primary-light text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-md"
            >
              Twitter
            </Link>
            <Link
              href="/#"
              className="text-background/40 hover:text-primary-light text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-md"
            >
              Instagram
            </Link>
            <Link
              href="/#"
              className="text-background/40 hover:text-primary-light text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-md"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

