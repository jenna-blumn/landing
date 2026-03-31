import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import CircularGallery from "@/components/CircularGallery";

const slides = [
  {
    id: 1,
    title: "카카오 브랜드메시지로\n마케팅 성과를 높이세요",
    description: "AI 세그먼트, 마케팅 자동화, 실시간 배송조회까지.\n루나M과 함께 메시지 마케팅을 최적화하세요.",
  },
  {
    id: 2,
    title: "주문부터 배송까지\n카카오알림톡으로 즉시 알림",
    description: "실시간 주문 알림으로 고객 만족도를 높여보세요.",
  },
  {
    id: 3,
    title: "고객 맞춤형 쿠폰으로\n전환율을 3배 상승",
    description: "타겟팅된 프로모션 메시지로 구매 전환을 극대화하세요.",
  },
];

// Generate gradient SVG card images for the gallery (using Lucide icon paths)
const createCardSvg = (c4: string, c6: string, label: string, iconPath: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c4}"/><stop offset="1" stop-color="${c6}"/></linearGradient>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="white" stop-opacity="0.08"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      </defs>
      <rect fill="url(#bg)" width="800" height="600" rx="40"/>
      <rect fill="url(#g)" width="800" height="600" rx="40"/>
      <circle cx="400" cy="240" r="72" fill="rgba(255,255,255,0.1)"/>
      <g transform="translate(400,240) scale(2.5) translate(-12,-12)" fill="none" stroke="rgba(255,255,255,0.95)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</g>
      <text x="400" y="400" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="36" font-weight="600" font-family="system-ui,-apple-system,sans-serif">${label}</text>
    </svg>`
  )}`;

// 4-color palette: olive, taupe, mauve, slate
const olive = ['#9da87e', '#636c42'] as const;
const taupe = ['#a8a09a', '#6e655e'] as const;
const mauve = ['#a899ac', '#6e5f74'] as const;
const slate = ['#99b0c0', '#5e7282'] as const;

const galleryItems = [
  { image: createCardSvg(olive[0], olive[1], '브랜드 메시지',
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/>') },
  { image: createCardSvg(taupe[0], taupe[1], '주문 알림',
      '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/>') },
  { image: createCardSvg(mauve[0], mauve[1], '배송 조회',
      '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>') },
  { image: createCardSvg(slate[0], slate[1], '쿠폰 발송',
      '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>') },
  { image: createCardSvg(olive[0], olive[1], '고객 세그먼트',
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>') },
  { image: createCardSvg(taupe[0], taupe[1], '마케팅 자동화',
      '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>') },
  { image: createCardSvg(mauve[0], mauve[1], '실시간 분석',
      '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>') },
  { image: createCardSvg(slate[0], slate[1], 'A/B 테스트',
      '<path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3"/><path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3"/><line x1="4" x2="20" y1="12" y2="12"/>') },
];

const highlightKeywords = (text: string) =>
  text.split(/(마케팅 성과|즉시 알림|3배 상승|루나M)/).map((part, j) =>
    /^(마케팅 성과|즉시 알림|3배 상승|루나M)$/.test(part)
      ? <span key={j} className="text-yellow-200">{part}</span>
      : part
  );

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)));

    const slideIndex = Math.min(2, Math.floor(progress * 3));
    setActiveSlide((prev) => (prev === slideIndex ? prev : slideIndex));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const galleryScrollOffset = scrollProgress * 30;

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-zinc-950">
        {/* Radial gradient glow */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(63,63,70,0.6) 0%, transparent 60%)',
          }}
        />

        {/* Text content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 h-full flex flex-col items-center justify-center pb-[20vh]">
          {/* Slide indicator */}
          <div className="flex items-center gap-1.5 mb-10">
            {slides.map((_, index) => (
              <div
                key={index}
                className="h-[3px] rounded-full"
                style={{
                  width: index === activeSlide ? 24 : 6,
                  backgroundColor: index === activeSlide ? 'white' : 'rgba(255,255,255,0.2)',
                  transition: 'width 400ms cubic-bezier(0.2, 0, 0, 1), background-color 400ms ease',
                }}
              />
            ))}
          </div>

          <div className="text-center max-w-4xl mx-auto mb-10">
            <div className="relative min-h-[2.4em]">
              {slides.map((slide, index) => (
                <h1
                  key={slide.id}
                  className={`heading-1 text-white ${
                    index === activeSlide
                      ? "opacity-100 relative translate-y-0"
                      : "opacity-0 absolute inset-0 translate-y-1"
                  }`}
                  style={{ transition: 'opacity 500ms ease, transform 500ms ease' }}
                >
                  {slide.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {highlightKeywords(line)}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </h1>
              ))}
            </div>

            <div className="relative mt-6">
              {slides.map((slide, index) => (
                <p
                  key={slide.id}
                  className={`text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed ${
                    index === activeSlide
                      ? "opacity-100 relative translate-y-0"
                      : "opacity-0 absolute inset-0 translate-y-1"
                  }`}
                  style={{ transition: 'opacity 500ms ease 75ms, transform 500ms ease 75ms' }}
                >
                  {slide.description.split("\n").map((line, i) => (
                    <span key={i}>
                      {highlightKeywords(line)}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig" target="_blank" rel="noopener noreferrer" className="btn-hero-primary press-scale group">
              상담 신청
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5" style={{ transition: 'transform 200ms ease' }} />
            </a>
            <a href="#features" className="btn-ghost-dark press-scale">
              서비스 소개
            </a>
          </div>
        </div>

        {/* ─── Circular Gallery ─── */}
        <div className="absolute bottom-0 left-0 right-0 h-[42vh] z-0">
          <CircularGallery
            items={galleryItems}
            bend={3}
            borderRadius={0.05}
            scrollOffset={galleryScrollOffset}
          />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-[5] pointer-events-none"
          style={{ background: 'linear-gradient(to top, #09090b, transparent)' }}
        />
      </div>
    </section>
  );
};

export default Hero;
