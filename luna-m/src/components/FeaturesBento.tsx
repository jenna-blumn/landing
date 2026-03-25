import { SECTION_MAX_WIDTH } from "@/lib/layout";
import { featureCards, gridCards } from "./features/featureCardsData";
import FeatureCard from "./features/FeatureCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STICKY_TOP_START = 80;   // px – below navbar
const STICKY_TOP_STEP  = 16;   // px – offset between stacked cards

const FeaturesBento = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal(0.2);
  const { ref: cardsRef, isRevealed: cardsRevealed } = useScrollReveal(0.05);
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal(0.1);

  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-zinc-100">
      <div ref={headerRef} className={`${SECTION_MAX_WIDTH} mx-auto text-center mb-14 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}>
        <span className="badge-section mb-5 inline-flex">
          핵심 장점
        </span>
        <h2 className="heading-2 text-zinc-900 lg:max-w-[60%] mx-auto">
          높은 도달률부터 안정적인 발송,
          <br />
          그리고 효율적인 운영까지
        </h2>
      </div>

      <div className={`${SECTION_MAX_WIDTH} mx-auto flex flex-col gap-5`}>
        {/* Sticky-stack cards (desktop only) */}
        <div ref={cardsRef} className={`flex flex-col gap-5 lg:gap-8 scroll-reveal ${cardsRevealed ? 'revealed' : ''}`}>
          {featureCards.map((card, i) => (
            <div
              key={card.id}
              className="lg:sticky"
              style={{
                top: STICKY_TOP_START + i * STICKY_TOP_STEP,
                zIndex: i + 1,
              }}
            >
              <FeatureCard card={card} />
            </div>
          ))}
        </div>

        {/* 3x2 그리드 */}
        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 scroll-reveal ${gridRevealed ? 'revealed' : ''}`}>
          {gridCards.map((card, i) => (
            <div key={card.id} className="scroll-reveal-item" style={{ '--reveal-i': i } as React.CSSProperties}>
              <FeatureCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBento;
