import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ContactCTA = () => {
  const { ref, isRevealed } = useScrollReveal(0.2);

  return (
    <section id="contact" className="relative z-20 bg-zinc-950 py-16 md:py-20">
      <div ref={ref} className={`max-w-[1280px] mx-auto px-6 scroll-reveal ${isRevealed ? 'revealed' : ''}`}>
        <div className="text-center mb-10">
          <h2 className="heading-2 text-white mb-5">
            루나M으로 마케팅을 혁신하세요
          </h2>

          <p className="desc-text-dark max-w-lg">
            전문 컨설턴트가 귀사에 최적화된 메시지 마케팅 전략을 무료로 상담해드립니다.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] px-7 py-3.5 text-[15px] text-zinc-900 bg-yellow-300 hover:bg-yellow-200 press-scale group" style={{ transition: 'background-color 150ms ease' }}>
            무료 도입 상담 신청
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5" style={{ transition: 'transform 200ms ease' }} />
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 pt-10 border-t border-zinc-800/50">
          {[
            '무료 상담',
            '빠른 도입 (1주일)',
            '24시간 기술 지원',
            '보안 인증',
          ].map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-zinc-300 text-[13px]">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
