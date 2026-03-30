import type { FeatureCard as FeatureCardType } from "./featureCardsData";

interface FeatureCardProps {
  card: FeatureCardType;
}

const heightClass: Record<number, string> = {
  270: "lg:h-[270px]",
  320: "lg:h-[320px]",
  420: "lg:h-[420px]",
};

const FeatureCard = ({ card }: FeatureCardProps) => {
  const hClass = heightClass[card.height ?? 320] ?? "lg:h-[320px]";
  const theme = card.dark ? "dark" : "light";

  if (card.compact) {
    return (
      <div className={`feature-card flex flex-col p-6 md:p-8 ${hClass}`} data-theme={theme} style={card.bgColor ? { background: card.bgColor } : undefined}>
        {/* Visual: absolute on lg, in-flow on mobile */}
        {card.visual && !card.visualFull && (
          <div className="relative lg:absolute lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[55%] order-2 lg:order-none mt-4 lg:mt-0">
            {card.visual}
          </div>
        )}
        {card.visual && card.visualFull && card.visual}

        {card.badge && (
          <div className="absolute top-6 right-6 z-10">
            <span
              className="px-2.5 py-1 text-[13px] font-semibold rounded-full"
              style={{
                background: 'linear-gradient(to bottom, #3f3f46, #18181b)',
                color: 'white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              {card.badge}
            </span>
          </div>
        )}
        <div className="relative z-[1] order-1 lg:order-none">
          <h3 className="fc-heading font-semibold text-xl md:text-2xl mb-3" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
            {card.title}
          </h3>
          {card.description && (
            <div className="flex flex-col gap-1.5">
              {card.description.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="fc-text text-[14px] leading-relaxed whitespace-pre-wrap" style={{ textWrap: 'pretty' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`feature-card p-6 md:p-8 ${hClass}`} data-theme={theme}>
      {card.badge && (
        <div className="absolute top-6 right-6">
          <span className="px-2.5 py-1 bg-white text-zinc-900 text-[13px] font-semibold rounded-full">
            {card.badge}
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start gap-8 h-full">
        <div className="lg:w-1/2 flex flex-col">
          <h3 className="fc-heading font-semibold text-xl md:text-2xl mb-3" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
            {card.title}
          </h3>

          {card.subtitle && (
            <p className="fc-text mb-3 text-[14px]">{card.subtitle}</p>
          )}

          {card.description && (
            <div className="flex flex-col gap-1.5">
              {card.description.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="fc-text text-[14px] leading-relaxed whitespace-pre-wrap" style={{ textWrap: 'pretty' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {card.tags && (
            <div className="mt-5 max-w-sm">
              {card.tagsTitle && (
                <h4 className="fc-text mb-2 text-sm font-semibold tracking-[0.01em]">
                  {card.tagsTitle}
                </h4>
              )}
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span key={tag} className="fc-tag px-3 py-1.5 rounded-lg text-[13px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 flex items-center justify-center">
          {card.visual}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
