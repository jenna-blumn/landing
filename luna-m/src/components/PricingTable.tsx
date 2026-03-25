type PricingItem = {
  type: string;
  price: string;
  note?: string;
};

type PricingGroup = {
  category: string;
  items: PricingItem[];
};

const pricingData: PricingGroup[] = [
  {
    category: '알림',
    items: [
      { type: '대량 웹발송', price: '6~9원', note: '발송량에 따라 협의가능' },
      { type: '카페24, 메이크샵 EC호스팅 연동 발송', price: '9원', note: '배송조회 기능 무료 제공' },
      { type: 'API', price: '가격 협의' },
    ],
  },
  {
    category: '브랜드메시지\n친구',
    items: [
      { type: '웹발송', price: '25원' },
      { type: '세그먼트 발송', price: '30원' },
      { type: 'API', price: '가격 협의' },
    ],
  },
  {
    category: '브랜드메시지\n비친구',
    items: [
      { type: '웹발송', price: '30원' },
      { type: '세그먼트 발송', price: '35원' },
      { type: 'API', price: '가격 협의' },
    ],
  },
  {
    category: '문자',
    items: [
      { type: 'SMS', price: '11원' },
      { type: 'LMS', price: '30원' },
    ],
  },
];

const CELL = 'px-5 py-3.5 md:px-6 md:py-4';

/** Standalone inner content — used inside ComparisonPricing tabs */
export const PricingTableContent = () => (
  <>
    {/* Table */}
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr className="bg-zinc-50/80">
            <th className={`${CELL} text-left text-sm font-semibold text-zinc-900 w-[22%]`}>구분</th>
            <th className={`${CELL} text-left text-sm font-semibold text-zinc-900 w-[43%]`}>타입</th>
            <th className={`${CELL} text-left text-sm font-semibold text-zinc-900 w-[35%]`}>가격</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map((group, gi) =>
            group.items.map((item, ii) => {
              const isFirstInGroup = ii === 0;
              const isLastGroup = gi === pricingData.length - 1;

              return (
                <tr
                  key={`${group.category}-${ii}`}
                  className="group hover:bg-zinc-50/50"
                  style={{
                    transition: 'background-color 150ms ease',
                    borderTop: isFirstInGroup && gi > 0 ? '1px solid rgba(0,0,0,0.08)' : undefined,
                  }}
                >
                  {isFirstInGroup && (
                    <td
                      rowSpan={group.items.length}
                      className={`${CELL} text-sm font-semibold text-zinc-900 align-middle whitespace-pre-line`}
                      style={{
                        borderRight: '1px solid rgba(0,0,0,0.06)',
                        borderBottom: !isLastGroup ? '1px solid rgba(0,0,0,0.08)' : undefined,
                      }}
                    >
                      {group.category}
                    </td>
                  )}
                  <td
                    className={`${CELL} text-sm text-zinc-700`}
                    style={{
                      borderTop: !isFirstInGroup ? '1px solid rgba(0,0,0,0.06)' : undefined,
                    }}
                  >
                    {item.type}
                  </td>
                  <td
                    className={`${CELL} text-sm`}
                    style={{
                      borderTop: !isFirstInGroup ? '1px solid rgba(0,0,0,0.06)' : undefined,
                    }}
                  >
                    <span className="font-semibold text-zinc-900">{item.price}</span>
                    {item.note && (
                      <span className="text-zinc-500 text-[13px] ml-1.5">({item.note})</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

    {/* Footnote */}
    <p className="text-center text-[13px] text-zinc-500 mt-6">
      * VAT 별도, 실제 비용은 발송량 및 계약 조건에 따라 달라질 수 있습니다.
    </p>
  </>
);

export default PricingTableContent;
