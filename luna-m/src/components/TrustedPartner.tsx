import { Shield, Users, Zap, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Shield,
    title: "카카오 공식 비즈메시지 파트너",
    description: "카카오로부터 인증받은 공식 파트너사로서 안정적인 서비스를 제공합니다.",
  },
  {
    icon: Zap,
    title: "안정적인 기술력과 컨설팅",
    description: "10년 이상의 메시징 서비스 경험으로 최적의 솔루션을 제안합니다.",
  },
  {
    icon: Users,
    title: "1:1 전담 매니저 케어",
    description: "도입부터 운영까지 전담 매니저가 밀착 지원해드립니다.",
  },
  {
    icon: Bot,
    title: "완전 자동화 시스템",
    description: "API 연동을 통한 자동 발송으로 운영 효율을 극대화합니다.",
  },
];

const useCountUp = (end: number, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!startCounting) return;
    setCount(0);
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [end, duration, startCounting]);

  return count;
};

type StatItem = {
  numericValue: number;
  prefix?: string;
  suffix: string;
  label: string;
  decimals?: number;
};

const statItems: StatItem[] = [
  { numericValue: 10, suffix: "년+", label: "서비스 운영" },
  { numericValue: 20000, suffix: "+", label: "기업 고객사" },
  { numericValue: 120, suffix: "억 건+", label: "누적 발송량" },
  { numericValue: 999, suffix: "%", prefix: "", label: "서비스 안정성", decimals: 1 },
  { numericValue: 48, suffix: "/5.0", prefix: "", label: "고객 만족도", decimals: 1 },
];

const formatStatValue = (item: StatItem, count: number) => {
  if (item.decimals === 1) {
    const val = (count / 10).toFixed(1);
    return `${item.prefix ?? ""}${val}${item.suffix}`;
  }
  const formatted = item.numericValue >= 1000
    ? count.toLocaleString()
    : count.toString();
  return `${item.prefix ?? ""}${formatted}${item.suffix}`;
};

const StatCounter = ({ item, startCounting }: { item: StatItem; startCounting: boolean }) => {
  const count = useCountUp(item.numericValue, 2000, startCounting);
  return (
    <p className="text-3xl sm:text-4xl font-semibold text-white mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatStatValue(item, count)}
    </p>
  );
};

const TrustedPartner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal(0.2);
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal(0.1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-zinc-950 overflow-hidden py-20 md:py-28">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15"
        src="https://www.pexels.com/ko-kr/download/video/2385276/"
      />

      {/* Top fade from hero */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-[1]"
        style={{ background: 'linear-gradient(to bottom, #09090b, transparent)' }}
      />

      <div className="relative z-10">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Header */}
          <div ref={headerRef} className={`text-center mb-14 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}>
            <span className="badge-section-dark mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              신뢰할 수 있는 파트너
            </span>

            <h2 className="heading-2 text-white mb-5">
              왜 <span className="text-yellow-200">루나M</span>인가요?
            </h2>
            <p className="desc-text-dark">
              카카오 공식 비즈메시지 파트너로서 10년 이상의 경험과 기술력으로
              <br className="hidden sm:block" />
              귀사의 성공적인 메시지 마케팅을 지원합니다.
            </p>
          </div>

          {/* Feature Grid */}
          <div ref={gridRef} className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-reveal ${gridRevealed ? 'revealed' : ''}`}>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group card-glass-dark scroll-reveal-item" style={{ '--reveal-i': i } as React.CSSProperties}>
                  <div className="icon-box-dark mb-4">
                    <Icon className="w-5 h-5 text-zinc-300 group-hover:text-zinc-200" style={{ transition: 'color 200ms' }} />
                  </div>
                  <h3 className="text-white font-semibold text-[15px] mb-2">{feature.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-16 pt-16 border-t border-zinc-800/60">
            {statItems.map((item) => (
              <div key={item.label} className="text-center">
                <StatCounter item={item} startCounting={isVisible} />
                <p className="text-zinc-300 text-[13px] font-medium">{item.label}</p>
              </div>
            ))}
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-1 overflow-hidden card-glass-dark !p-0">
                <img src="https://cdn.prod.website-files.com/65fbab61ea85400f3507e37f/665d8687b688e1399f605da6_img_2.png" alt="ISMS 인증" className="w-full h-full object-contain p-2" />
              </div>
              <p className="text-zinc-300 text-[13px] font-medium">ISMS 인증</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartner;
