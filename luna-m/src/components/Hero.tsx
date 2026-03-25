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
    title: "주문부터 배송까지\n카카오톡으로 즉시 알림",
    description: "실시간 주문 알림으로 고객 만족도를 높여보세요.",
  },
  {
    id: 3,
    title: "고객 맞춤형 쿠폰으로\n전환율을 3배 상승",
    description: "타겟팅된 프로모션 메시지로 구매 전환을 극대화합니다.",
  },
];

// Generate gradient SVG card images for the gallery
const createCardSvg = (c4: string, c6: string, label: string, iconPath: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c4}"/><stop offset="1" stop-color="${c6}"/></linearGradient>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="white" stop-opacity="0.12"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      </defs>
      <rect fill="url(#bg)" width="800" height="600" rx="40"/>
      <rect fill="url(#g)" width="800" height="600" rx="40"/>
      <g transform="translate(400,230) scale(1.12)" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${iconPath}</g>
      <text x="400" y="390" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="38" font-weight="600" font-family="system-ui,-apple-system,sans-serif">${label}</text>
    </svg>`
  )}`;

const galleryItems = [
  { image: createCardSvg('#a3a3a3','#525252', '브랜드 메시지',
      '<rect x="-24" y="-18" width="48" height="36" rx="5"/><polyline points="-8,18 0,28 8,18"/>') },
  { image: createCardSvg('#a8a29e','#57534e', '주문 알림',
      '<path d="M0-24a16 16 0 00-16 16v12h32v-12a16 16 0 00-16-16"/><line x1="-18" y1="4" x2="18" y2="4"/><path d="M-4 4a4 4 0 008 0"/>') },
  { image: createCardSvg('#a09890','#6e655e', '배송 조회',
      '<rect x="-24" y="-10" width="32" height="22" rx="3"/><path d="M8-10v22h16v-14l-8-8z"/><circle cx="-8" cy="14" r="5"/><circle cx="16" cy="14" r="5"/>') },
  { image: createCardSvg('#a899ac','#6e5f74', '쿠폰 발송',
      '<rect x="-24" y="-16" width="48" height="32" rx="5"/><line x1="-4" y1="-16" x2="-4" y2="16" stroke-dasharray="4 4"/><circle cx="-4" cy="-16" r="5" fill="#8B7B8E" stroke="rgba(255,255,255,0.9)"/><circle cx="-4" cy="16" r="5" fill="#8B7B8E" stroke="rgba(255,255,255,0.9)"/>') },
  { image: createCardSvg('#99b0c0','#5e7282', '고객 세그먼트',
      '<circle cx="-10" cy="-6" r="10"/><circle cx="14" cy="-6" r="10"/><path d="M-24 18a14 14 0 0128 0"/><path d="M0 18a14 14 0 0128 0"/>') },
  { image: createCardSvg('#9da87e','#636c42', '마케팅 자동화',
      '<polygon points="0,-24 4,-8 -12,-8"/><polygon points="0,24 -4,8 12,8"/><line x1="-20" y1="0" x2="20" y2="0"/>') },
  { image: createCardSvg('#8a8a8a','#4a4a4a', '실시간 분석',
      '<line x1="-20" y1="20" x2="-20" y2="-4"/><line x1="-6" y1="20" x2="-6" y2="-16"/><line x1="8" y1="20" x2="8" y2="0"/><line x1="22" y1="20" x2="22" y2="-22"/><line x1="-24" y1="20" x2="26" y2="20"/>') },
  { image: createCardSvg('#9c938c','#635b55', 'A/B 테스트',
      '<rect x="-24" y="-18" width="20" height="36" rx="4"/><rect x="4" y="-18" width="20" height="36" rx="4"/><line x1="-14" y1="4" x2="-14" y2="12" stroke-dasharray="3 3"/><line x1="14" y1="4" x2="14" y2="12" stroke-dasharray="3 3"/>') },
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
