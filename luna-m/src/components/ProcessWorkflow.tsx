import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    step: 1,
    title: "회원가입 / 서비스 계약",
    description: "서비스 이용을 위한 계정 생성 및 이용 약관 동의를 진행합니다.",
  },
  {
    step: 2,
    title: "서버 세팅",
    description: "안정적인 알림톡 발송을 위한 전용 서버 환경을 구축합니다.",
  },
  {
    step: 3,
    title: "호스팅사 관리자 설정",
    description: "호스팅사 및 서버 관리자 권한을 설정하여 연동을 준비합니다.",
  },
  {
    step: 4,
    title: "카카오톡 채널 생성",
    description: "비즈니스 인증을 거친 공식 카카오톡 채널을 개설합니다.",
  },
  {
    step: 5,
    title: "템플릿 등록 / 승인",
    description: "발송할 알림톡 메시지 템플릿을 등록하고 검수 승인을 받습니다.",
  },
  {
    step: 6,
    title: "충전 / 알림톡 발송",
    description: "비용 충전 후 설정된 템플릿으로 고객에게 알림톡을 발송합니다.",
  },
];

const ProcessWorkflow = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal(0.2);
  const { ref: row1Ref, isRevealed: row1Revealed } = useScrollReveal(0.15);
  const { ref: row2Ref, isRevealed: row2Revealed } = useScrollReveal(0.15);

  return (
    <section className="relative z-20 bg-background py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}>
          <span className="badge-section mb-5 inline-flex">
            진행 절차
          </span>

          <h2 className="heading-2 text-foreground mb-5">
            서비스 진행 절차
          </h2>
          <p className="desc-text max-w-lg">
            복잡한 과정 없이 빠르고 간편하게 시작하세요.
            <br className="hidden sm:block" />
            신청부터 발송까지 원스톱으로 지원합니다.
          </p>
        </div>

        {/* Row 1: Steps 1-3 */}
        <div ref={row1Ref} className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-y-4 items-stretch mb-4 scroll-reveal ${row1Revealed ? 'revealed' : ''}`}>
          {steps.slice(0, 3).map((item, index) => (
            <Fragment key={item.step}>
              <div
                className="relative bg-white rounded-2xl p-6 scroll-reveal-item"
                style={{
                  '--reveal-i': index,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)',
                } as React.CSSProperties}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold mb-4"
                  style={{
                    background: 'linear-gradient(to bottom, #3f3f46, #18181b)',
                    color: 'white',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.step}
                </div>
                <h3 className="text-foreground font-semibold text-[15px] mb-1.5" style={{ letterSpacing: '-0.01em' }}>
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-[13px] leading-relaxed" style={{ textWrap: 'pretty' }}>
                  {item.description}
                </p>
              </div>
              {index < 2 && (
                <div className="hidden sm:flex items-center justify-center w-8">
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Row 2: Steps 4-6 */}
        <div ref={row2Ref} className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-y-4 items-stretch scroll-reveal ${row2Revealed ? 'revealed' : ''}`}>
          {steps.slice(3, 6).map((item, index) => (
            <Fragment key={item.step}>
              <div
                className="relative bg-white rounded-2xl p-6 scroll-reveal-item"
                style={{
                  '--reveal-i': index,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)',
                } as React.CSSProperties}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold mb-4"
                  style={{
                    background: 'linear-gradient(to bottom, #3f3f46, #18181b)',
                    color: 'white',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.step}
                </div>
                <h3 className="text-foreground font-semibold text-[15px] mb-1.5" style={{ letterSpacing: '-0.01em' }}>
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-[13px] leading-relaxed" style={{ textWrap: 'pretty' }}>
                  {item.description}
                </p>
              </div>
              {index < 2 && (
                <div className="hidden sm:flex items-center justify-center w-8">
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5"
          >
            지금 바로 시작하기
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProcessWorkflow;
