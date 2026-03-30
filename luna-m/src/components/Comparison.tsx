import { Check, X } from 'lucide-react';

type ComparisonRow = {
  feature: string;
  alimtalk: string | boolean;
  bizmsg: string | boolean;
};

const comparisonData: ComparisonRow[] = [
  { feature: '메시지 성격', alimtalk: '정보성·안내성 메시지', bizmsg: '마케팅·홍보·브랜드 메시지' },
  { feature: '발송 대상', alimtalk: '휴대폰 번호 기반 고객', bizmsg: '카카오 채널 친구' },
  { feature: '광고성 메시지 발송', alimtalk: false, bizmsg: true },
  { feature: '지원 메시지 포맷', alimtalk: '텍스트 중심', bizmsg: '이미지형, 와이드형, 캐러셀형, 커머스형' },
  { feature: '이미지 사용', alimtalk: false, bizmsg: true },
  { feature: '버튼 삽입', alimtalk: true, bizmsg: true },
  { feature: '발송 조건', alimtalk: '사전 등록된 템플릿 필수', bizmsg: '자유로운 메시지 작성' },
  { feature: '템플릿 심사', alimtalk: '필수 (카카오 사전 승인)', bizmsg: '불필요' },
  { feature: '주요 활용 사례', alimtalk: '주문/배송 안내, 예약 알림, 인증', bizmsg: '이벤트, 프로모션, 쿠폰 발송' },
  { feature: '권장 사용 목적', alimtalk: '고객 안내 자동화', bizmsg: '브랜드 홍보 및 매출 증대' },
];

const CELL = 'px-5 py-3.5 md:px-6 md:py-4';

const renderCell = (value: string | boolean) => {
  if (typeof value === 'boolean') {
    return value ? (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <span className="text-sm text-emerald-600 font-medium">가능</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-zinc-600" />
        </div>
        <span className="text-sm text-zinc-600 font-medium">불가</span>
      </div>
    );
  }
  return <span className="text-sm">{value}</span>;
};

/** Standalone inner content — used inside ComparisonPricing tabs */
export const ComparisonContent = () => (
  <>
    {/* Comparison Table */}
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {/* Table Header */}
      <div className="grid grid-cols-3">
        <div className={`${CELL} font-semibold text-zinc-900 text-sm bg-zinc-50/80`}>구분</div>
        <div className={`${CELL} text-center bg-zinc-50/80`}>
          <span className="font-semibold text-zinc-600 text-sm">알림톡</span>
        </div>
        <div
          className={`${CELL} text-center rounded-tr-[15px]`}
          style={{
            background: 'linear-gradient(to bottom, #27272a, #18181b)',
          }}
        >
          <span className="font-semibold text-white text-sm">비즈메시지</span>
        </div>
      </div>

      {/* Table Body */}
      {comparisonData.map((row, index) => (
        <div
          key={row.feature}
          className={`grid grid-cols-3 group ${index !== comparisonData.length - 1 ? 'border-b border-zinc-100/80' : ''}`}
        >
          <div className={`${CELL} flex items-center text-zinc-900 font-medium text-sm group-hover:bg-zinc-50/50`} style={{ transition: 'background-color 150ms ease' }}>
            {row.feature}
          </div>
          <div className={`${CELL} flex items-center justify-center text-zinc-600 group-hover:bg-zinc-50/50`} style={{ transition: 'background-color 150ms ease' }}>
            {renderCell(row.alimtalk)}
          </div>
          <div
            className={`${CELL} flex items-center justify-center text-zinc-700 bg-zinc-50/40 group-hover:bg-zinc-100/60`}
            style={{ transition: 'background-color 150ms ease' }}
          >
            {renderCell(row.bizmsg)}
          </div>
        </div>
      ))}
    </div>

    {/* Bottom note */}
    <p className="text-center text-zinc-500 text-[13px] mt-6">
      * 실제 비용은 발송량 및 계약 조건에 따라 달라질 수 있습니다.
    </p>
  </>
);

export default ComparisonContent;
