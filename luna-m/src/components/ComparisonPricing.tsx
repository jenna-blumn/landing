import { SECTION_MAX_WIDTH } from '@/lib/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ComparisonContent } from '@/components/Comparison';
import { PricingTableContent } from '@/components/PricingTable';
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ComparisonPricing = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal(0.2);

  return (
    <section id="comparison" className="relative z-20 bg-white py-20 md:py-28">
      <div className={`${SECTION_MAX_WIDTH} mx-auto px-6`}>
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-10 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}>
          <span className="badge-section mb-5 inline-flex">
            메시지 비교 & 가격
          </span>
          <h2 className="heading-2 text-zinc-900 mb-4">
            메시지 통합지원
          </h2>
          <p className="desc-text">
            알림톡과 비즈메시지, 목적에 맞는 메시지를 선택하고 합리적인 가격으로 시작하세요.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="comparison" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="h-12 bg-zinc-100 rounded-xl p-1 gap-1">
              <TabsTrigger
                value="comparison"
                className="rounded-lg px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 transition-all"
              >
                메시지 비교
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="rounded-lg px-6 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 transition-all"
              >
                발송 타입별 가격표
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="comparison" className="mt-0">
            <ComparisonContent />
          </TabsContent>

          <TabsContent value="pricing" className="mt-0">
            <PricingTableContent />
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5"
          >
            맞춤 견적 받기 →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ComparisonPricing;
